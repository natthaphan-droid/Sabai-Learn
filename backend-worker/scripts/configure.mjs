import { readFile,writeFile,mkdir,copyFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
try {
  const config = JSON.parse(await readFile(resolve(root,'setup.config.json'),'utf8'));
  const account = JSON.parse(await readFile(resolve(root,config.firebaseServiceAccountFile),'utf8'));
  for (const key of ['firebaseApiKey','googleOAuthClientId','googleOAuthClientSecret']) if (!config[key] || config[key].startsWith('ใส่')) throw new Error(`กรุณาเติม ${key} ใน setup.config.json`);
  for (const key of ['project_id','client_email','private_key']) if (!account[key]) throw new Error('ไฟล์บัญชีบริการ Firebase ไม่ครบ');
  await mkdir(resolve(root,'secrets'),{ recursive:true });
  let previous = {};
  try { previous = JSON.parse(await readFile(resolve(root,'secrets/worker-secrets.json'),'utf8')); } catch { /* First setup. */ }
  const values = { FIREBASE_PROJECT_ID:account.project_id,FIREBASE_API_KEY:config.firebaseApiKey,FIREBASE_SERVICE_ACCOUNT:JSON.stringify({ project_id:account.project_id,client_email:account.client_email,private_key:account.private_key }),GOOGLE_OAUTH_CLIENT_ID:config.googleOAuthClientId,GOOGLE_OAUTH_CLIENT_SECRET:config.googleOAuthClientSecret,DRIVE_TOKEN_ENCRYPTION_KEY:previous.DRIVE_TOKEN_ENCRYPTION_KEY || randomBytes(32).toString('base64'),BOOTSTRAP_SECRET:previous.BOOTSTRAP_SECRET || randomBytes(32).toString('base64url') };
  if (Object.values(values).some(value => value.includes("'"))) throw new Error('ค่าตั้งค่ามีอักขระที่ไม่รองรับ');
  try { await copyFile(resolve(root,'.dev.vars'),resolve(root,'secrets/previous-local.env')); } catch(error) { if (error.code !== 'ENOENT') throw error; }
  await writeFile(resolve(root,'secrets/worker-secrets.json'),JSON.stringify(values,null,2));
  await writeFile(resolve(root,'.dev.vars'),Object.entries({ ...values,APP_ORIGIN:config.localOrigin || 'http://127.0.0.1:5173' }).map(([key,value]) => `${key}='${value}'`).join('\n') + '\n');
  console.log('เตรียมค่าตั้งค่าแล้ว เก็บกุญแจไว้ใน secrets/ และไม่แสดงในหน้าจอ');
} catch(error) { console.error(error.code === 'ENOENT' ? 'ยังไม่มี setup.config.json หรือไฟล์บัญชีบริการ อ่าน SETUP.md ก่อนเริ่ม' : error.message); process.exitCode = 1; }
