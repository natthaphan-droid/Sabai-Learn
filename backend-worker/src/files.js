import { HttpError, requireThat, validateFile } from './domain.js';
import { hash, randomToken, encryptToken, exchangeGoogleCode, driveAccess, googleDrive } from './integrations.js';
import { sql, first, run, json, accessClass, accessLesson, accessItem, setting, saveSetting, originOf, nowISO } from './data.js';
export async function handleDrive(request, env, user, url) {
  if (url.pathname === '/api/admin/drive/connect' && request.method === 'POST') {
    requireThat(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.DRIVE_TOKEN_ENCRYPTION_KEY, 'ระบบ Google Drive ยังไม่ได้ตั้งค่า', 503);
    const state = randomToken(), verifier = randomToken();
    await env.DB.batch([sql(env, 'DELETE FROM sl_oauth_states WHERE expires_at<=?', Date.now()), sql(env, 'INSERT INTO sl_oauth_states(state_hash,user_id,verifier,expires_at) VALUES(?,?,?,?)', await hash(state), user.id, verifier, Date.now() + 600000)]);
    const oauth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauth.search = new URLSearchParams({ client_id: env.GOOGLE_OAUTH_CLIENT_ID, redirect_uri: `${originOf(request, env)}/api/admin/drive/callback`, response_type: 'code', scope: 'https://www.googleapis.com/auth/drive.file', access_type: 'offline', prompt: 'consent', state, code_challenge: await hash(verifier), code_challenge_method: 'S256' }).toString();
    return json({ url: oauth.href });
  }
  if (url.pathname === '/api/admin/drive/callback' && request.method === 'GET') {
    const state = await first(env, 'DELETE FROM sl_oauth_states WHERE state_hash=? AND user_id=? AND expires_at>? RETURNING verifier', await hash(url.searchParams.get('state') || ''), user.id, Date.now());
    requireThat(state && url.searchParams.get('code') && !url.searchParams.has('error'), 'การอนุญาต Drive ไม่สำเร็จ กรุณาเริ่มใหม่');
    const tokens = await exchangeGoogleCode(env, url.searchParams.get('code'), state.verifier, `${originOf(request, env)}/api/admin/drive/callback`);
    const account = await (await googleDrive(tokens.access_token, 'about?fields=user')).json(), previous = await setting(env, 'drive_connection');
    requireThat(!previous || previous.ownerId === account.user.permissionId, 'กรุณาเชื่อมบัญชี Google เดิมเพื่อเปิดไฟล์เก่า');
    let rootId = previous?.rootId;
    if (!rootId) rootId = (await (await googleDrive(tokens.access_token, 'files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Sabai Learn', mimeType: 'application/vnd.google-apps.folder' }) })).json()).id;
    await saveSetting(env, 'drive_connection', { rootId, ownerId: account.user.permissionId, ownerName: account.user.displayName, refreshToken: await encryptToken(env, tokens.refresh_token) });
    return Response.redirect(`${originOf(request, env)}/admin/settings?drive=connected`, 303);
  }
  if (url.pathname === '/api/admin/drive/status' && request.method === 'GET') {
    const connection = await setting(env, 'drive_connection');
    if (!connection) return json({ connected: false });
    const token = await driveAccess(env, connection);
    await googleDrive(token, `files/${encodeURIComponent(connection.rootId)}?fields=id`);
    const about = await (await googleDrive(token, 'about?fields=storageQuota,user')).json();
    return json({ connected: true, ownerName: about.user.displayName, quota: about.storageQuota });
  }
  throw new HttpError(404, 'ไม่พบคำขอ');
}
export async function uploadFile(request, env, user, url) {
  const lessonId = url.searchParams.get('lessonId'), itemId = url.searchParams.get('itemId');
  requireThat(Boolean(lessonId) !== Boolean(itemId), 'ต้องระบุคาบเรียนหรืองาน');
  let target;
  if (lessonId) { requireThat(user.role === 'admin', 'เฉพาะครูเพิ่มเอกสารบทเรียนได้', 403); target = await accessLesson(env, user, lessonId); }
  else {
    target = await accessItem(env, user, itemId);
    if (user.role !== 'admin') {
      requireThat(target.accepts_submission, 'รายการนี้ไม่รับไฟล์', 403);
      requireThat(!await first(env, 'SELECT 1 FROM sl_scores WHERE item_id=? AND user_id=?', itemId, user.id), 'ครูตรวจงานแล้ว ให้ครูเปิดรับแก้ไขก่อน', 409);
    }
  }
  let name; try { name = decodeURIComponent(request.headers.get('X-File-Name') || ''); } catch { throw new HttpError(400, 'ชื่อไฟล์ไม่ถูกต้อง'); }
  const mime = request.headers.get('Content-Type')?.split(';')[0], size = Number(request.headers.get('X-File-Size'));
  validateFile(name, mime, size);
  requireThat(request.body, 'ไฟล์ว่าง');
  const connection = await setting(env, 'drive_connection'), token = await driveAccess(env, connection), classroom = await accessClass(env, user, target.class_id);
  const folderKey = `drivefolder:${target.class_id}`;
  let folderId = await setting(env, folderKey);
  if (!folderId) {
    folderId = (await (await googleDrive(token, 'files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${classroom.year}-${classroom.term} ${classroom.grade}/${classroom.room} ${classroom.title}`, mimeType: 'application/vnd.google-apps.folder', parents: [connection.rootId] }) })).json()).id;
    await saveSetting(env, folderKey, folderId);
  }
  let driveId;
  try {
    driveId = (await (await googleDrive(token, 'files?fields=id', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${user.role === 'student' ? `${user.username}_` : ''}${name}`, mimeType: mime, parents: [folderId] }) })).json()).id;
    let bytes = 0, firstChunk = true;
    const stream = request.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        bytes += chunk.byteLength;
        requireThat(bytes <= size, 'ขนาดไฟล์ไม่ตรงกับที่ระบุ', 413);
        if (firstChunk) {
          const prefix = new TextDecoder().decode(chunk.slice(0, 32)).trimStart().toLowerCase();
          requireThat(!prefix.startsWith('<') && !(chunk[0] === 0x4d && chunk[1] === 0x5a), 'เนื้อหาไฟล์ไม่ใช่เอกสารที่รองรับ');
          firstChunk = false;
        }
        controller.enqueue(chunk);
      },
      flush() { requireThat(bytes === size, 'ไฟล์อัปโหลดไม่ครบ'); },
    }));
    const uploaded = await (await googleDrive(token, `files/${encodeURIComponent(driveId)}?uploadType=media&fields=id,size`, { method: 'PATCH', headers: { 'Content-Type': mime, 'Content-Length': String(size) }, body: stream }, true)).json();
    requireThat(bytes === size && Number(uploaded.size) === size, 'ไฟล์อัปโหลดไม่ครบ', 503);
    const id = crypto.randomUUID();
    await run(env, 'INSERT INTO sl_files(id,owner_id,lesson_id,item_id,drive_id,name,mime,size,created_at) VALUES(?,?,?,?,?,?,?,?,?)', id, user.id, lessonId, itemId, driveId, name, mime, size, nowISO());
    return json({ file: { id, name, mime, size, owner_id: user.id, lesson_id: lessonId, item_id: itemId } }, 201);
  } catch (error) {
    if (driveId) { try { await googleDrive(token, `files/${encodeURIComponent(driveId)}`, { method: 'DELETE' }); } catch { /* Cleanup failure never creates a successful submission. */ } }
    throw error;
  }
}
export async function readFile(request, env, user, id, url) {
  const file = await first(env, 'SELECT f.*,u.role AS owner_role FROM sl_files f JOIN sl_users u ON u.id=f.owner_id WHERE f.id=?', id);
  requireThat(file, 'ไม่พบไฟล์', 404);
  if (file.lesson_id) await accessLesson(env, user, file.lesson_id); else await accessItem(env, user, file.item_id);
  requireThat(user.role === 'admin' || file.owner_role === 'admin' || file.owner_id === user.id, 'ไม่มีสิทธิ์เปิดไฟล์นี้', 403);
  const connection = await setting(env, 'drive_connection'), token = await driveAccess(env, connection);
  const response = await googleDrive(token, `files/${encodeURIComponent(file.drive_id)}?alt=media`);
  const inline = !url.searchParams.has('download') && (file.mime === 'application/pdf' || file.mime.startsWith('image/'));
  return new Response(response.body, { headers: { 'Content-Type': file.mime, 'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="document.${file.name.split('.').pop()}"; filename*=UTF-8''${encodeURIComponent(file.name)}`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'self'; sandbox" } });
}
