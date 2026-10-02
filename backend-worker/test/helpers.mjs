import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { generateKeyPairSync } from 'node:crypto';
import app from '../src/platform.js';
const { privateKey } = generateKeyPairSync('rsa', { modulusLength:2048,privateKeyEncoding:{ type:'pkcs8',format:'pem' },publicKeyEncoding:{ type:'spki',format:'pem' } });
export function environment() {
  const database = new DatabaseSync(':memory:');
  database.exec(readFileSync(new URL('../migrations/0001_classroom.sql',import.meta.url),'utf8'));
  function prepare(query) {
    let args = [];
    return { bind(...values) { args = values; return this; }, first() { return database.prepare(query).get(...args) || null; }, all() { return { results:database.prepare(query).all(...args) }; }, run() { const result = database.prepare(query).run(...args); return { success:true,meta:{ changes:Number(result.changes) } }; } };
  }
  const env = { DB:{ prepare,batch(statements) { database.exec('BEGIN'); try { const result = statements.map(s => s.run()); database.exec('COMMIT'); return result; } catch (error) { database.exec('ROLLBACK'); throw error; } } }, FIREBASE_API_KEY:'local-test-key',FIREBASE_PROJECT_ID:'sabai-test',FIREBASE_SERVICE_ACCOUNT:JSON.stringify({ client_email:'local-test@example.invalid',private_key:privateKey }),GOOGLE_OAUTH_CLIENT_ID:'local-test-client',GOOGLE_OAUTH_CLIENT_SECRET:'local-test-secret',DRIVE_TOKEN_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64'),BOOTSTRAP_SECRET:'local-test-setup-secret' };
  const state = { identities:new Map(),files:new Map(),failUpload:false,sequence:0 };
  const response = (body,status=200) => new Response(JSON.stringify(body),{ status,headers:{ 'Content-Type':'application/json' } });
  async function provider(input,options={}) {
    const url = new URL(typeof input === 'string' ? input : input.url);
    if (url.hostname === 'oauth2.googleapis.com') {
      const body = new URLSearchParams(options.body);
      return response({ access_token:'local-test-access',expires_in:3600,...(body.get('grant_type') === 'authorization_code' ? { refresh_token:'local-test-refresh' } : {}) });
    }
    if (url.hostname === 'identitytoolkit.googleapis.com') {
      const body = JSON.parse(options.body);
      if (url.pathname.endsWith('accounts:signUp')) {
        if ([...state.identities.values()].some(user => user.email === body.email)) return response({ error:{ message:'EMAIL_EXISTS' } },400);
        state.identities.set(body.localId,{ ...body }); return response({ localId:body.localId });
      }
      if (url.pathname.endsWith('accounts:signInWithPassword')) {
        const identity = [...state.identities.values()].find(user => user.email === body.email && user.password === body.password && !user.disabled);
        return identity ? response({ localId:identity.localId,idToken:'local-test-id-token' }) : response({ error:{ message:'INVALID_LOGIN_CREDENTIALS' } },400);
      }
      if (url.pathname.endsWith('accounts:update')) {
        const identity = state.identities.get(body.localId);
        if (!identity) return response({ error:{ message:'USER_NOT_FOUND' } },400);
        if (body.password) identity.password = body.password;
        if (body.disableUser !== undefined) identity.disabled = body.disableUser;
        return response({ localId:identity.localId });
      }
      if (url.pathname.endsWith('accounts:delete')) { state.identities.delete(body.localId); return response({}); }
    }
    if (url.hostname === 'www.googleapis.com') {
      if (url.pathname.endsWith('/about')) return response({ user:{ permissionId:'local-owner',displayName:'ครูทดสอบ' },storageQuota:{ usage:'100000',limit:'15000000000' } });
      if (url.pathname.endsWith('/files') && options.method === 'POST') { const metadata = JSON.parse(options.body), id = `drive-${++state.sequence}`; state.files.set(id,{ ...metadata,id,content:Buffer.alloc(0) }); return response({ id }); }
      const id = url.pathname.match(/\/files\/([^/]+)$/)?.[1], file = state.files.get(id);
      if (options.method === 'DELETE') { state.files.delete(id); return new Response(null,{ status:204 }); }
      if (!file) return response({ error:{ message:'notFound' } },404);
      if (options.method === 'PATCH') {
        if (state.failUpload) { state.failUpload = false; return response({ error:{ message:'storageQuotaExceeded' } },403); }
        file.content = Buffer.from(await new Response(options.body).arrayBuffer());
        return response({ id,size:String(file.content.length) });
      }
      if (url.searchParams.get('alt') === 'media') return new Response(file.content,{ headers:{ 'Content-Type':file.mimeType } });
      return response({ id });
    }
    throw new Error(`Unexpected external request: ${url.origin}${url.pathname}`);
  }
  async function call(path,{ method='GET',body,cookie,headers={},raw,origin='https://sabai.test' }={}) {
    const response = await app.fetch(new Request(`https://sabai.test/api${path}`,{ method,headers:{ ...(body !== undefined ? { 'Content-Type':'application/json' } : {}),...(cookie ? { Cookie:cookie } : {}),...(!['GET','HEAD'].includes(method) ? { Origin:origin } : {}),...headers },body:raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined }),env);
    return { response,status:response.status,data:response.headers.get('Content-Type')?.includes('application/json') ? await response.clone().json() : null,cookie:response.headers.get('Set-Cookie')?.split(';')[0] };
  }
  return { env,database,state,provider,call };
}
export async function seed(fixture) {
  const { call } = fixture;
  function check(result) { if (result.status >= 400) throw new Error(JSON.stringify(result.data)); return result; }
  const teacher = check(await call('/setup',{ method:'POST',headers:{ 'X-Setup-Key':'local-test-setup-secret' },body:{ username:'teacher',name:'ครูทดสอบ',password:'TeacherFirst123' } })).data.user;
  let teacherCookie = check(await call('/auth/login',{ method:'POST',body:{ username:'teacher',password:'TeacherFirst123' } })).cookie;
  check(await call('/auth/password',{ method:'PUT',cookie:teacherCookie,body:{ currentPassword:'TeacherFirst123',password:'TeacherNew456' } }));
  teacherCookie = check(await call('/auth/login',{ method:'POST',body:{ username:'teacher',password:'TeacherNew456' } })).cookie;
  const classA = check(await call('/admin/classes',{ method:'POST',cookie:teacherCookie,body:{ title:'คณิตศาสตร์พื้นฐาน',grade:'ม.4',room:'1',year:'2569',term:1,subject:'basic' } })).data.id;
  const classB = check(await call('/admin/classes',{ method:'POST',cookie:teacherCookie,body:{ title:'คณิตศาสตร์เพิ่มเติม',grade:'ม.5',room:'2',year:'2569',term:1,subject:'additional' } })).data.id;
  const studentA = check(await call('/admin/students',{ method:'POST',cookie:teacherCookie,body:{ username:'00123',name:'นักเรียนห้องหนึ่ง',password:'StudentFirst123',classIds:[classA] } })).data.student;
  const studentB = check(await call('/admin/students',{ method:'POST',cookie:teacherCookie,body:{ username:'00456',name:'นักเรียนห้องสอง',password:'StudentFirst456',classIds:[classB] } })).data.student;
  const lessonA = check(await call('/admin/lessons',{ method:'POST',cookie:teacherCookie,body:{ classId:classA,title:'เซตและการดำเนินการของเซต',date:'2026-10-01',notes:'เซตคือกลุ่มของสิ่งต่าง ๆ ที่ระบุสมาชิกได้ชัดเจน\n\nA = {1, 2, 3} และ B = {3, 4}\nยูเนียน A ∪ B = {1, 2, 3, 4}\nอินเตอร์เซกชัน A ∩ B = {3}\n\nลองหาคำตอบเมื่อ A = {2, 4, 6} และ B = {4, 6, 8} แล้วทำใบงานประกอบคาบ',videoUrl:'',published:true } })).data.id;
  const itemA = check(await call('/admin/items',{ method:'POST',cookie:teacherCookie,body:{ classId:classA,lessonId:lessonA,title:'ใบงานเซต 1',description:'แสดงวิธีทำข้อ 1–3 ถ่ายภาพหรือส่ง PDF หรือส่งกระดาษให้ครู',category:'coursework',maxScore:10,acceptsSubmission:true,dueAt:'2026-09-30T16:59:00.000Z',published:true } })).data.id;
  const itemB = check(await call('/admin/items',{ method:'POST',cookie:teacherCookie,body:{ classId:classB,title:'ใบงานตรีโกณมิติ',description:'ทบทวนอัตราส่วนตรีโกณมิติ',category:'coursework',maxScore:20,acceptsSubmission:true,dueAt:'2026-10-05T16:59:00.000Z',published:true } })).data.id;
  const activity = check(await call('/admin/items',{ method:'POST',cookie:teacherCookie,body:{ classId:classA,title:'กิจกรรมในคาบ',category:'coursework',maxScore:30,acceptsSubmission:false,published:true } })).data.id;
  const midterm = check(await call('/admin/items',{ method:'POST',cookie:teacherCookie,body:{ classId:classA,title:'สอบกลางภาค',category:'midterm',maxScore:40,acceptsSubmission:false,published:true } })).data.id;
  const final = check(await call('/admin/items',{ method:'POST',cookie:teacherCookie,body:{ classId:classA,title:'สอบปลายภาค',category:'final',maxScore:50,acceptsSubmission:false,published:true } })).data.id;
  const connect = check(await call('/admin/drive/connect',{ method:'POST',cookie:teacherCookie,body:{} }));
  const state = new URL(connect.data.url).searchParams.get('state');
  check(await call(`/admin/drive/callback?state=${state}&code=local-code`,{ cookie:teacherCookie }));
  check(await call('/admin/contact',{ method:'PUT',cookie:teacherCookie,body:{ teacherName:'ครูทดสอบ (ข้อมูลทดสอบ)',lineUrl:'https://line.me',contactHours:'จันทร์–ศุกร์ 08:30–16:30 น.' } }));
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  const content = 'BT /F1 18 Tf 60 760 Td (Sets worksheet - LOCAL TEST DATA) Tj 0 -40 Td /F1 12 Tf (A = {1, 2, 3}   B = {3, 4}) Tj 0 -30 Td (1. Find the union of A and B.) Tj 0 -30 Td (2. Find the intersection of A and B.) Tj ET';
  objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  let pdf = '%PDF-1.7\n', offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = Buffer.from(pdf);
  const file = check(await call(`/files?lessonId=${lessonA}`,{ method:'POST',cookie:teacherCookie,headers:{ 'Content-Type':'application/pdf','X-File-Name':encodeURIComponent('ใบงานเซต.pdf'),'X-File-Size':String(bytes.length) },raw:bytes })).data.file;
  return { teacher,teacherCookie,classA,classB,studentA,studentB,lessonA,itemA,itemB,activity,midterm,final,file };
}
