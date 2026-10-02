export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function requireThat(condition, message, status = 400) { if (!condition) throw new HttpError(status, message); }
export function textValue(value, label, max = 200, optional = false) {
  requireThat(typeof value === 'string', `กรุณาระบุ${label}`);
  const result = value.trim();
  requireThat((optional || result.length > 0) && result.length <= max, `${label}ไม่ถูกต้องหรือยาวเกินไป`);
  return result;
}
export function passwordValue(value) {
  requireThat(typeof value === 'string' && value.length >= 8 && value.length <= 128, 'รหัสผ่านต้องมี 8–128 ตัวอักษร');
  return value;
}
export function usernameValue(value) {
  const result = textValue(value, 'รหัสผู้ใช้', 40);
  requireThat(/^[a-zA-Z0-9_-]+$/.test(result), 'รหัสผู้ใช้ใช้ตัวเลข ตัวอักษรอังกฤษ _ หรือ -');
  return result;
}
export function numberValue(value, min, max, label) {
  requireThat(value !== '' && value !== null && typeof value !== 'boolean', `${label}ไม่ถูกต้อง`);
  const n = Number(value);
  requireThat(Number.isFinite(n) && n >= min && n <= max, `${label}ต้องอยู่ระหว่าง ${min}–${max}`);
  return n;
}
export function dateValue(value) {
  requireThat(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'วันที่เรียนไม่ถูกต้อง');
  return value;
}
export function dueValue(value) {
  if (!value) return null;
  requireThat(typeof value === 'string' && Number.isFinite(Date.parse(value)), 'กำหนดส่งไม่ถูกต้อง');
  return new Date(value).toISOString();
}
export function videoValue(value = '') {
  if (!value) return '';
  let url; try { url = new URL(value); } catch { throw new HttpError(400, 'ลิงก์วิดีโอไม่ถูกต้อง'); }
  requireThat(url.protocol === 'https:' && !url.username && !url.password, 'ใช้ลิงก์วิดีโอ HTTPS');
  return url.href;
}
export function contactValue(data) {
  const lineUrl = data.lineUrl || '';
  if (lineUrl) {
    let url; try { url = new URL(lineUrl); } catch { throw new HttpError(400, 'ลิงก์ LINE ไม่ถูกต้อง'); }
    requireThat(url.protocol === 'https:' && ['line.me','lin.ee','www.line.me'].includes(url.hostname) && !url.username && !url.password, 'กรุณาใช้ลิงก์ line.me หรือ lin.ee');
  }
  return { teacherName: textValue(data.teacherName, 'ชื่อครู', 100), lineUrl, contactHours: textValue(data.contactHours || '', 'เวลาติดต่อ', 200, true) };
}
export function statusOf(item, now = Date.now()) {
  if (item.reopened) return 'revision';
  if (item.score !== null && item.score !== undefined) return 'graded';
  if (item.submitted_at) return 'submitted';
  return item.due_at && Date.parse(item.due_at) < now ? 'overdue' : 'pending';
}
export function summarizeScores(items) {
  const groups = Object.entries({ coursework: 60, midterm: 20, final: 20 }).map(([category, weight]) => {
    const rows = items.filter(item => item.category === category && item.published);
    const maximum = rows.reduce((sum, row) => sum + Number(row.max_score), 0);
    const earned = rows.reduce((sum, row) => sum + (row.score === null || row.score === undefined ? 0 : Number(row.score)), 0);
    const graded = rows.filter(row => row.score !== null && row.score !== undefined).length;
    return { category, weight, maximum, earned, graded, count: rows.length, weighted: maximum ? earned / maximum * weight : null };
  });
  return { groups, total: groups.reduce((sum, group) => sum + (group.weighted || 0), 0), complete: groups.every(group => group.count > 0 && group.graded === group.count) };
}
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
const mimeTypes = { pdf: ['application/pdf'], doc: ['application/msword'], docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'], webp: ['image/webp'] };
export function validateFile(name, mime, size) {
  requireThat(typeof name === 'string' && name.length > 0 && name.length <= 200 && !/[\x00-\x1f/\\]/.test(name), 'ชื่อไฟล์ไม่ถูกต้อง');
  const extension = name.split('.').pop().toLowerCase();
  requireThat(mimeTypes[extension]?.includes(mime), 'รับเฉพาะ PDF, DOC, DOCX, JPG, PNG หรือ WebP');
  requireThat(Number.isInteger(size) && size > 0 && size <= MAX_FILE_SIZE, 'ไฟล์ต้องไม่เกิน 10 MB');
}
