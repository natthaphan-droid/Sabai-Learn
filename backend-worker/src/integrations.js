import jwt from '@tsndr/cloudflare-worker-jwt';
import { HttpError, requireThat } from './domain.js';

export const base64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const randomToken = () => base64url(crypto.getRandomValues(new Uint8Array(32)));
export const hash = async value => base64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
const serviceTokens = new Map();

async function serviceToken(env) {
  requireThat(env.FIREBASE_SERVICE_ACCOUNT, 'ระบบบัญชีผู้ใช้ยังไม่ได้ตั้งค่า', 503);
  let account; try { account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT); } catch { throw new HttpError(503, 'การตั้งค่าระบบบัญชีผู้ใช้ไม่ถูกต้อง'); }
  const cached = serviceTokens.get(account.client_email);
  if (cached && cached.expires > Date.now()) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const assertion = await jwt.sign({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/identitytoolkit', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }, account.private_key, { algorithm: 'RS256' });
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  const data = await response.json();
  requireThat(response.ok && data.access_token, 'เชื่อมระบบบัญชีผู้ใช้ไม่ได้ กรุณาลองใหม่', 503);
  serviceTokens.set(account.client_email, { token: data.access_token, expires: Date.now() + 45 * 60 * 1000 });
  return data.access_token;
}
async function identityRequest(env, method, body, admin = false) {
  requireThat(env.FIREBASE_API_KEY && env.FIREBASE_PROJECT_ID, 'ระบบบัญชีผู้ใช้ยังไม่ได้ตั้งค่า', 503);
  const token = admin ? await serviceToken(env) : null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${method}?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) {
    const reason = data.error?.message || '';
    if (/TOO_MANY|QUOTA|RATE_LIMIT/.test(reason) || response.status === 429) throw new HttpError(429, 'บริการบัญชีผู้ใช้จำกัดจำนวนครั้ง กรุณาลองภายหลัง');
    if (/INVALID_LOGIN|INVALID_PASSWORD|EMAIL_NOT_FOUND|USER_DISABLED/.test(reason)) throw new HttpError(401, 'ชื่อเข้าใช้หรือรหัสผ่านไม่ถูกต้อง');
    if (/EMAIL_EXISTS|DUPLICATE_LOCAL_ID/.test(reason)) throw new HttpError(409, 'บัญชีนี้มีอยู่แล้ว');
    throw new HttpError(503, 'บริการบัญชีผู้ใช้ไม่พร้อม กรุณาตรวจการตั้งค่า');
  }
  return data;
}
export const signIn = (env, email, password) => identityRequest(env, 'accounts:signInWithPassword', { email, password, returnSecureToken: true });
export const createIdentity = (env, user, password) => identityRequest(env, 'accounts:signUp', { targetProjectId: env.FIREBASE_PROJECT_ID, localId: user.id, email: user.auth_email, password, displayName: user.name }, true);
export const updateIdentity = (env, id, changes) => identityRequest(env, `projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/accounts:update`, { localId: id, ...changes }, true);
export const deleteIdentity = (env, id) => identityRequest(env, `projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/accounts:delete`, { localId: id }, true);

async function encryptionKey(env) {
  requireThat(env.DRIVE_TOKEN_ENCRYPTION_KEY, 'ระบบไฟล์ยังไม่ได้ตั้งค่า', 503);
  let bytes; try { bytes = Uint8Array.from(atob(env.DRIVE_TOKEN_ENCRYPTION_KEY), ch => ch.charCodeAt(0)); } catch { throw new HttpError(503, 'การตั้งค่าระบบไฟล์ไม่ถูกต้อง'); }
  requireThat(bytes.length === 32, 'การตั้งค่าระบบไฟล์ไม่ถูกต้อง', 503);
  return crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
export async function encryptToken(env, value) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await encryptionKey(env), new TextEncoder().encode(value));
  return `${base64url(iv)}.${base64url(cipher)}`;
}
export async function decryptToken(env, value) {
  const decode = part => Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
  const [iv, cipher] = value.split('.').map(decode);
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, await encryptionKey(env), cipher));
}
export async function exchangeGoogleCode(env, code, verifier, redirectUri) {
  requireThat(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET, 'ระบบ Google Drive ยังไม่ได้ตั้งค่า', 503);
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: redirectUri, client_id: env.GOOGLE_OAUTH_CLIENT_ID, client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET }) });
  const data = await response.json();
  requireThat(response.ok && data.access_token && data.refresh_token, 'เชื่อม Google Drive ไม่สำเร็จ กรุณาอนุญาตใหม่', 503);
  return data;
}
export async function driveAccess(env, connection) {
  requireThat(connection && env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET, 'ครูยังไม่ได้เชื่อม Google Drive', 503);
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: await decryptToken(env, connection.refreshToken), client_id: env.GOOGLE_OAUTH_CLIENT_ID, client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET }) });
  const data = await response.json();
  requireThat(response.ok && data.access_token, 'การเชื่อม Drive หมดอายุ ให้ครูเชื่อมบัญชีเดิมใหม่', 503);
  return data.access_token;
}
export async function googleDrive(token, path, options = {}, upload = false) {
  const response = await fetch(`https://www.googleapis.com/${upload ? 'upload/' : ''}drive/v3/${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers } });
  if (!response.ok) {
    let reason = ''; try { reason = JSON.stringify(await response.json()); } catch { /* Only provider error codes are inspected. */ }
    if (/storageQuotaExceeded|quotaExceeded|rateLimitExceeded/.test(reason) || response.status === 429) throw new HttpError(503, 'พื้นที่หรือโควตา Google Drive ไม่เพียงพอ กรุณาติดต่อครู');
    throw new HttpError(503, 'อ่านหรือบันทึกไฟล์ใน Google Drive ไม่สำเร็จ ให้ครูตรวจการเชื่อมต่อ');
  }
  return response;
}
