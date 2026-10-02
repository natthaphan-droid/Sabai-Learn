import { requireThat, textValue, usernameValue, passwordValue } from './domain.js';
import { createIdentity, deleteIdentity } from './integrations.js';
export const nowISO = () => new Date().toISOString();
export const sql = (env, query, ...values) => env.DB.prepare(query).bind(...values);
export const first = (env, query, ...values) => sql(env, query, ...values).first();
export const rows = async (env, query, ...values) => (await sql(env, query, ...values).all()).results;
export const run = (env, query, ...values) => sql(env, query, ...values).run();
export const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
export const publicUser = user => ({ id: user.id, username: user.username, name: user.name, role: user.role, active: user.active, mustChange: Boolean(user.must_change) });
export const originOf = (request, env) => env.APP_ORIGIN || new URL(request.url).origin;
export const setting = async (env, key) => { const row = await first(env, 'SELECT value FROM sl_settings WHERE key=?', key); return row ? JSON.parse(row.value) : null; };
export const saveSetting = (env, key, value) => run(env, 'INSERT INTO sl_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, JSON.stringify(value));
export async function readBody(request) {
  requireThat(request.headers.get('Content-Type')?.includes('application/json'), 'ข้อมูลคำขอไม่ถูกต้อง', 415);
  requireThat(Number(request.headers.get('Content-Length') || 0) <= 80000, 'ข้อมูลคำขอยาวเกินไป', 413);
  requireThat(request.body, 'ข้อมูลคำขอไม่ถูกต้อง');
  const reader = request.body.getReader(), decoder = new TextDecoder();
  let raw = '', bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 80000) { await reader.cancel(); requireThat(false, 'ข้อมูลคำขอยาวเกินไป', 413); }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } finally { reader.releaseLock(); }
  requireThat(raw.length <= 40000, 'ข้อมูลคำขอยาวเกินไป', 413);
  let data; try { data = JSON.parse(raw); } catch { requireThat(false, 'ข้อมูลคำขอไม่ถูกต้อง'); }
  requireThat(data && typeof data === 'object' && !Array.isArray(data), 'ข้อมูลคำขอไม่ถูกต้อง');
  return data;
}
export async function accessClass(env, user, id) {
  const classroom = await first(env, 'SELECT * FROM sl_classes WHERE id=?', id);
  requireThat(classroom, 'ไม่พบห้องเรียน', 404);
  if (user.role !== 'admin') requireThat(classroom.active && await first(env, 'SELECT 1 FROM sl_enrollments WHERE class_id=? AND user_id=? AND active=1', id, user.id), 'ไม่มีสิทธิ์เข้าห้องเรียนนี้', 403);
  return classroom;
}
export async function accessLesson(env, user, id) {
  const lesson = await first(env, 'SELECT * FROM sl_lessons WHERE id=?', id);
  requireThat(lesson, 'ไม่พบคาบเรียน', 404);
  await accessClass(env, user, lesson.class_id);
  requireThat(user.role === 'admin' || lesson.published, 'คาบเรียนยังไม่เผยแพร่', 403);
  return lesson;
}
export async function accessItem(env, user, id) {
  const item = await first(env, 'SELECT * FROM sl_items WHERE id=?', id);
  requireThat(item, 'ไม่พบงานหรือรายการคะแนน', 404);
  await accessClass(env, user, item.class_id);
  requireThat(user.role === 'admin' || item.published, 'งานยังไม่เผยแพร่', 403);
  return item;
}
export async function enrolledStudent(env, classId, userId) {
  const user = await first(env, "SELECT u.* FROM sl_users u JOIN sl_enrollments e ON e.user_id=u.id WHERE u.id=? AND u.role='student' AND e.class_id=? AND e.active=1 AND u.active=1", userId, classId);
  requireThat(user, 'นักเรียนไม่ได้อยู่ในห้องนี้หรือบัญชีถูกปิด');
  return user;
}
export async function newAccount(env, data, role) {
  const id = crypto.randomUUID();
  const user = { id, username: usernameValue(data.username), auth_email: `u-${id}@sabai-learn.invalid`, name: textValue(data.name, 'ชื่อ', 150), role };
  const password = passwordValue(data.password);
  requireThat(!await first(env, 'SELECT id FROM sl_users WHERE username=?', user.username), 'รหัสผู้ใช้นี้มีอยู่แล้ว', 409);
  await run(env, 'INSERT INTO sl_users(id,username,auth_email,name,role,active,created_at) VALUES(?,?,?,?,?,0,?)', id, user.username, user.auth_email, user.name, role, nowISO());
  let created = false;
  try {
    const identity = await createIdentity(env, user, password);
    created = true;
    requireThat(identity.localId === id, 'บริการบัญชีส่งข้อมูลไม่ตรงกัน', 503);
    await run(env, 'UPDATE sl_users SET active=1 WHERE id=?', id);
  } catch (error) {
    if (created) { try { await deleteIdentity(env, id); } catch { /* Without its D1 record this identity cannot enter the classroom. */ } }
    await run(env, 'DELETE FROM sl_users WHERE id=?', id);
    throw error;
  }
  return publicUser({ ...user, active: 1, must_change: 1 });
}
export async function assignClasses(env, userId, classIds) {
  requireThat(Array.isArray(classIds) && classIds.length <= 50 && classIds.every(id => typeof id === 'string'), 'รายชื่อห้องเรียนไม่ถูกต้อง');
  for (const id of classIds) requireThat(await first(env, 'SELECT id FROM sl_classes WHERE id=?', id), 'ไม่พบห้องเรียน');
  await env.DB.batch([sql(env, 'UPDATE sl_enrollments SET active=0 WHERE user_id=?', userId), ...[...new Set(classIds)].map(id => sql(env, 'INSERT INTO sl_enrollments(class_id,user_id,active) VALUES(?,?,1) ON CONFLICT(class_id,user_id) DO UPDATE SET active=1', id, userId))]);
}
export async function studentOverview(env, user) {
  const allowed = 'SELECT class_id FROM sl_enrollments e JOIN sl_classes c ON c.id=e.class_id WHERE e.user_id=? AND e.active=1 AND c.active=1';
  const classes = await rows(env, `SELECT * FROM sl_classes WHERE id IN (${allowed}) ORDER BY year DESC,term DESC,grade,room`, user.id);
  const lessons = await rows(env, `SELECT * FROM sl_lessons WHERE published=1 AND class_id IN (${allowed}) ORDER BY lesson_date DESC`, user.id);
  const items = await rows(env, `SELECT i.*,s.id AS submission_id,s.mode,s.note AS submission_note,s.submitted_at,s.reopened,g.score,g.feedback FROM sl_items i LEFT JOIN sl_submissions s ON s.item_id=i.id AND s.user_id=? LEFT JOIN sl_scores g ON g.item_id=i.id AND g.user_id=? WHERE i.published=1 AND i.class_id IN (${allowed}) ORDER BY i.due_at,i.title`, user.id, user.id, user.id);
  const files = await rows(env, `SELECT f.id,f.name,f.mime,f.size,f.lesson_id,f.item_id,f.owner_id,sf.submission_id FROM sl_files f JOIN sl_users u ON u.id=f.owner_id LEFT JOIN sl_submission_files sf ON sf.file_id=f.id WHERE ((u.role='admin' AND ((f.lesson_id IN (SELECT id FROM sl_lessons WHERE published=1 AND class_id IN (${allowed}))) OR (f.item_id IN (SELECT id FROM sl_items WHERE published=1 AND class_id IN (${allowed}))))) OR (f.owner_id=? AND f.item_id IN (SELECT id FROM sl_items WHERE published=1 AND class_id IN (${allowed}))))`, user.id, user.id, user.id, user.id);
  return { classes, lessons, items, files, contact: await setting(env, 'contact') };
}
export async function adminOverview(env) {
  const [classes, users, enrollments, lessons, items, submissions, scores, followups, files, contact, connection] = await Promise.all([
    rows(env, 'SELECT * FROM sl_classes ORDER BY year DESC,term DESC,grade,room'), rows(env, "SELECT id,username,name,active,must_change FROM sl_users WHERE role='student' ORDER BY username"), rows(env, 'SELECT * FROM sl_enrollments'), rows(env, 'SELECT * FROM sl_lessons ORDER BY lesson_date DESC'), rows(env, 'SELECT * FROM sl_items ORDER BY title'), rows(env, 'SELECT * FROM sl_submissions'), rows(env, 'SELECT * FROM sl_scores'), rows(env, 'SELECT * FROM sl_followups'), rows(env, 'SELECT f.id,f.name,f.mime,f.size,f.lesson_id,f.item_id,f.owner_id,sf.submission_id FROM sl_files f LEFT JOIN sl_submission_files sf ON sf.file_id=f.id'), setting(env, 'contact'), setting(env, 'drive_connection'),
  ]);
  return { classes, users, enrollments, lessons, items, submissions, scores, followups, files, contact, drive: { connected: Boolean(connection), ownerName: connection?.ownerName || '', configured: Boolean(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.DRIVE_TOKEN_ENCRYPTION_KEY) } };
}
