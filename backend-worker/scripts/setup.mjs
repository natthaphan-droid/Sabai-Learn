import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { stdin, stdout } from 'node:process';
import dotenv from 'dotenv';
let hidden = false;
const output = new Writable({ write(chunk, encoding, callback) { if (!hidden) stdout.write(chunk, encoding); callback(); } });
const input = createInterface({ input: stdin, output, terminal: Boolean(stdin.isTTY) });
try {
  const env = dotenv.parse(await readFile(new URL('../.dev.vars', import.meta.url)));
  if (!env.BOOTSTRAP_SECRET) throw new Error('ยังไม่ได้เตรียมค่าตั้งค่า อ่าน SETUP.md ก่อน');
  const target = new URL((await input.question('URL เว็บ (เช่น http://127.0.0.1:5173): ')).trim());
  if (target.username || target.password || target.pathname !== '/' || target.search || target.hash || !(target.protocol === 'https:' || (target.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(target.hostname)))) throw new Error('ใช้ URL หน้าแรกของเว็บ HTTPS หรือเว็บในเครื่อง');
  const username = await input.question('ชื่อเข้าใช้ครู: '), name = await input.question('ชื่อครู: ');
  stdout.write('รหัสผ่านเริ่มต้น (8–128 ตัวอักษร จะไม่แสดงบนจอ): ');
  hidden = true;
  const password = await input.question('');
  hidden = false; stdout.write('\n');
  if (password.length < 8 || password.length > 128) throw new Error('รหัสผ่านต้องมี 8–128 ตัวอักษร');
  const response = await fetch(`${target.origin}/api/setup`, { method: 'POST', headers: { Origin: target.origin, 'Content-Type': 'application/json', 'X-Setup-Key': env.BOOTSTRAP_SECRET }, body: JSON.stringify({ username, name, password }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  console.log('สร้างบัญชีครูแล้ว เข้าเว็บด้วยชื่อที่ตั้ง และเปลี่ยนรหัสผ่านครั้งแรก');
} catch (error) { console.error(error.code === 'ENOENT' ? 'ยังไม่มีไฟล์ค่าตั้งค่า อ่าน SETUP.md ก่อน' : error.message); process.exitCode = 1; }
finally { hidden = false; input.close(); }
