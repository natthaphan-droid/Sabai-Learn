import { HttpError, requireThat, usernameValue, passwordValue, textValue } from './domain.js';
import { randomToken, hash, signIn, updateIdentity } from './integrations.js';
import { sql, first, run, json, publicUser, readBody, originOf, newAccount, studentOverview, accessItem, nowISO } from './data.js';
import { handleAdmin } from './admin.js';
import { uploadFile, readFile } from './files.js';
const cookie = (request, env, token, age = 43200) => `sabai_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${originOf(request, env).startsWith('https:') ? '; Secure' : ''}`;
async function authenticate(request, env) {
  const token = request.headers.get('Cookie')?.match(/(?:^|;\s*)sabai_session=([A-Za-z0-9_-]+)/)?.[1];
  requireThat(token, 'กรุณาเข้าสู่ระบบ', 401);
  const user = await first(env, 'SELECT u.* FROM sl_sessions s JOIN sl_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1', await hash(token), Date.now());
  requireThat(user, 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', 401);
  return { user, token };
}
async function login(request, env) {
  requireThat(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID && env.FIREBASE_SERVICE_ACCOUNT, 'ห้องเรียนกำลังเตรียมระบบบัญชีผู้ใช้ กรุณาติดต่อครู', 503);
  const data = await readBody(request), username = usernameValue(data.username);
  requireThat(typeof data.password === 'string' && data.password.length <= 128, 'ชื่อเข้าใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
  const key = await hash(`${request.headers.get('CF-Connecting-IP') || 'local'}:${username.toLowerCase()}`), expires = Date.now() + 600000;
  const limit = await first(env, 'INSERT INTO sl_login_limits(key,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires_at<=? THEN 1 ELSE attempts+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING attempts', key, expires, Date.now(), Date.now());
  requireThat(limit.attempts <= 10, 'ลองเข้าใช้หลายครั้งเกินไป กรุณารอ 10 นาที', 429);
  const user = await first(env, 'SELECT * FROM sl_users WHERE username=? AND active=1', username);
  requireThat(user, 'ชื่อเข้าใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
  const identity = await signIn(env, user.auth_email, data.password);
  requireThat(identity.localId === user.id, 'ชื่อเข้าใช้หรือรหัสผ่านไม่ถูกต้อง', 401);
  const token = randomToken();
  await env.DB.batch([sql(env, 'DELETE FROM sl_sessions WHERE expires_at<=?', Date.now()), sql(env, 'DELETE FROM sl_login_limits WHERE key=? OR expires_at<=?', key, Date.now()), sql(env, 'INSERT INTO sl_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)', await hash(token), user.id, Date.now() + 43200000)]);
  return json({ user: publicUser(user) }, 200, { 'Set-Cookie': cookie(request, env, token) });
}
async function submit(request, env, user, id) {
  const item = await accessItem(env, user, id);
  requireThat(user.role === 'student' && item.accepts_submission, 'ไม่มีสิทธิ์ส่งงานนี้', 403);
  const data = await readBody(request);
  requireThat(Array.isArray(data.fileIds) && data.fileIds.length > 0 && data.fileIds.length <= 10 && data.fileIds.every(value => typeof value === 'string') && new Set(data.fileIds).size === data.fileIds.length, 'แนบไฟล์ 1–10 ไฟล์ก่อนส่ง');
  for (const fileId of data.fileIds) requireThat(await first(env, 'SELECT id FROM sl_files WHERE id=? AND owner_id=? AND item_id=?', fileId, user.id, id), 'ไฟล์ไม่ถูกต้องหรือยังอัปโหลดไม่สำเร็จ');
  const submissionId = crypto.randomUUID(), revision = crypto.randomUUID();
  const result = await env.DB.batch([
    sql(env, "INSERT INTO sl_submissions(id,item_id,user_id,mode,note,submitted_at,revision) SELECT ?,?,?,'online',?,?,? WHERE NOT EXISTS(SELECT 1 FROM sl_scores WHERE item_id=? AND user_id=?) ON CONFLICT(item_id,user_id) DO UPDATE SET mode='online',note=excluded.note,submitted_at=excluded.submitted_at,reopened=0,revision=excluded.revision WHERE NOT EXISTS(SELECT 1 FROM sl_scores WHERE item_id=? AND user_id=?)", submissionId, id, user.id, textValue(data.note || '', 'ข้อความ', 4000, true), nowISO(), revision, id, user.id, id, user.id),
    sql(env, 'DELETE FROM sl_submission_files WHERE submission_id IN (SELECT id FROM sl_submissions WHERE item_id=? AND user_id=? AND revision=?)', id, user.id, revision),
    ...data.fileIds.map(fileId => sql(env, 'INSERT INTO sl_submission_files(submission_id,file_id) SELECT id,? FROM sl_submissions WHERE item_id=? AND user_id=? AND revision=?', fileId, id, user.id, revision)),
  ]);
  requireThat(result[0].meta.changes === 1, 'ครูตรวจงานแล้ว ให้ครูเปิดรับแก้ไขก่อนส่งใหม่', 409);
  return json({ id: (await first(env, 'SELECT id FROM sl_submissions WHERE item_id=? AND user_id=?', id, user.id)).id });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Sabai Learn API');
    try {
      requireThat(env.DB, 'ฐานข้อมูลยังไม่ได้ตั้งค่า', 503);
      if (!['GET','HEAD','OPTIONS'].includes(request.method)) requireThat(request.headers.get('Origin') === originOf(request, env), 'คำขอไม่ได้มาจากเว็บไซต์นี้', 403);
      if (url.pathname === '/api/health' && request.method === 'GET') return json({ authenticationConfigured: Boolean(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID && env.FIREBASE_SERVICE_ACCOUNT), setupRequired: !await first(env, "SELECT id FROM sl_users WHERE role='admin'") });
      if (url.pathname === '/api/setup' && request.method === 'POST') {
        requireThat(env.BOOTSTRAP_SECRET, 'การสร้างบัญชีครูยังไม่พร้อม', 503);
        requireThat(await hash(request.headers.get('X-Setup-Key') || '') === await hash(env.BOOTSTRAP_SECRET), 'ไม่มีสิทธิ์สร้างบัญชีครู', 403);
        requireThat(!await first(env, "SELECT id FROM sl_users WHERE role='admin'"), 'สร้างบัญชีครูไว้แล้ว', 409);
        return json({ user: await newAccount(env, await readBody(request), 'admin') }, 201);
      }
      if (url.pathname === '/api/auth/login' && request.method === 'POST') return await login(request, env);
      const { user, token } = await authenticate(request, env);
      if (url.pathname === '/api/auth/me' && request.method === 'GET') return json({ user: publicUser(user) });
      if (url.pathname === '/api/auth/logout' && request.method === 'POST') { await run(env, 'DELETE FROM sl_sessions WHERE token_hash=?', await hash(token)); return json({ ok: true }, 200, { 'Set-Cookie': cookie(request, env, '', 0) }); }
      if (url.pathname === '/api/auth/password' && request.method === 'PUT') {
        const data = await readBody(request);
        requireThat(typeof data.currentPassword === 'string' && data.currentPassword.length > 0 && data.currentPassword.length <= 128, 'กรุณาระบุรหัสผ่านปัจจุบัน');
        const identity = await signIn(env, user.auth_email, data.currentPassword);
        requireThat(identity.localId === user.id, 'รหัสผ่านปัจจุบันไม่ถูกต้อง', 401);
        requireThat(data.password !== data.currentPassword, 'กรุณาใช้รหัสผ่านใหม่');
        await updateIdentity(env, user.id, { password: passwordValue(data.password) });
        await env.DB.batch([sql(env, 'UPDATE sl_users SET must_change=0 WHERE id=?', user.id), sql(env, 'DELETE FROM sl_sessions WHERE user_id=?', user.id)]);
        return json({ ok: true }, 200, { 'Set-Cookie': cookie(request, env, '', 0) });
      }
      requireThat(!user.must_change, 'กรุณาเปลี่ยนรหัสผ่านเริ่มต้นก่อน', 428);
      if (url.pathname.startsWith('/api/admin/')) { requireThat(user.role === 'admin', 'เฉพาะครูผู้ดูแล', 403); return await handleAdmin(request, env, user, url); }
      if (url.pathname === '/api/overview' && request.method === 'GET') return json(await studentOverview(env, user));
      if (url.pathname === '/api/files' && request.method === 'POST') return await uploadFile(request, env, user, url);
      const file = url.pathname.match(/^\/api\/files\/([^/]+)$/);
      if (file && request.method === 'GET') return await readFile(request, env, user, file[1], url);
      const submission = url.pathname.match(/^\/api\/assignments\/([^/]+)\/submit$/);
      if (submission && request.method === 'POST') return await submit(request, env, user, submission[1]);
      throw new HttpError(404, 'ไม่พบคำขอ');
    } catch (error) {
      if (!error.status) console.error('Sabai Learn API operation failed:', error.constructor?.name || 'Error');
      return json({ error: error.status ? error.message : 'ระบบไม่พร้อม กรุณาลองใหม่หรือติดต่อครู' }, error.status || 500);
    }
  },
};
