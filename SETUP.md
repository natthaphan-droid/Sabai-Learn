# เตรียม Sabai Learn ให้เปิดใช้งานจริง

เว็บเผยแพร่แล้วที่ [sabai-learn.natthaphan.workers.dev](https://sabai-learn.natthaphan.workers.dev) พร้อมฐานข้อมูล D1 และการเผยแพร่จาก GitHub สำรองฐานข้อมูลเดิมและเพิ่มตารางห้องเรียนแล้ว

สถานะเว็บนี้: Firebase เชื่อมแล้ว มีครู `teacher` และ Google OAuth อยู่ในโหมด In production เชื่อม Drive ของครูและตรวจการเชื่อมต่อผ่านเว็บสำเร็จ ขั้นตอนด้านล่างเก็บไว้สำหรับติดตั้งใหม่

## นำเข้ารายชื่อนักเรียน

เปิด **นักเรียน → นำเข้ารายชื่อจาก Excel** เลือกไฟล์ `.xlsx` หรือ `.csv` ไม่เกิน 2 MB เลือกแผ่นงาน แถวหัวตาราง และคอลัมน์รหัสนักเรียน/ชื่อ ระบบเก็บรหัสเป็นข้อความตามที่แสดงใน Excel รวมศูนย์นำหน้า เลือกห้องเดิมหรือสร้างห้องพร้อมรายชื่อได้

ไฟล์รายชื่อโรงเรียนที่มีหัวเอกสาร `ชั้นมัธยมศึกษาปีที่ 4/1 ภาคเรียนที่ 2 ปีการศึกษา 2568` และตาราง `ที่ / เลขฯ / ชื่อ - สกุล` รองรับหลายห้องในแผ่นงานเดียว เลือกอ่านชั้นและห้องจากหัวเอกสาร แล้วแก้ปีและภาคเรียนเป็นปีที่ต้องการก่อนนำเข้า ตรวจตัวอย่างก่อนกดสร้างบัญชี

บัญชีใหม่ใช้รหัสนักเรียนเป็นชื่อเข้าใช้และรหัสเริ่มต้น `12345678` ต้องตั้งรหัสใหม่อย่างน้อย 8 ตัวอักษรก่อนเข้าห้องเรียน ครูรีเซ็ตได้จากรายชื่อนักเรียน นักเรียนต้องเปลี่ยนรหัสอีกครั้งหลังรีเซ็ต บัญชีเดิมที่ชื่อถูกต้องจะเพิ่มเข้าห้องโดยรักษารหัสผ่าน คะแนน และห้องเดิม บัญชีที่ปิดไว้หรือชื่อไม่ตรงจะหยุดให้ตรวจ

นำเข้าทีละคนและแสดงผลที่บันทึกจริง หากเชื่อมต่อล้มเหลวหรือถึงโควตาให้กดนำเข้าต่อเฉพาะรายการที่เหลือ ดาวน์โหลดผลพร้อมรหัสเริ่มต้นเป็น Excel ก่อนปิดหน้าต่าง เก็บไฟล์ไว้เฉพาะครูและแจกรหัสเป็นรายบุคคล

เชื่อม Firebase และสร้างครูก่อนได้ แล้วเพิ่ม Google OAuth สำหรับไฟล์ภายหลัง ทำขั้นตอน 1 และ 3 ด้วยบัญชีครูหรือผู้ดูแล จากนั้นส่งค่าตั้งค่าขึ้น Cloudflare ด้วย `secret bulk` และสร้างครูตามขั้นตอน 5 ไม่ต้องส่งรหัสผ่านหรือไฟล์กุญแจในแชต ระหว่างที่ยังไม่มีครู หน้าเข้าสู่ระบบจะแจ้งว่ากำลังเตรียมบัญชีผู้ใช้

## 1. สร้าง Firebase สำหรับบัญชีผู้ใช้

1. เปิด [Firebase Console](https://console.firebase.google.com/) แล้วสร้างโปรเจกต์ เช่น `Sabai Learn` ไม่ต้องเปิด Google Analytics
2. ใช้แผน **Spark** และไม่ผูกบัญชี Billing ระบบนี้ใช้ Authentication แบบ Email/Password ซึ่งอยู่ในบริการพื้นฐานของ [แผน Firebase](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) การผูก Billing จะเปลี่ยนเป็น Blaze
3. ไปที่ **Build → Authentication → Get started → Sign-in method** เปิด **Email/Password** ส่วน Email link และ Phone ไม่ต้องเปิด
4. ไปที่ **Project settings → General → Your apps** เพิ่ม Web app ตั้งชื่อ `Sabai Learn` ไม่ต้องเลือก Firebase Hosting คัดลอกค่า `apiKey` เก็บไว้ใช้ในขั้นตอน 3
5. ไปที่ **Project settings → Service accounts → Generate new private key** ดาวน์โหลด JSON แล้วเก็บเป็น `backend-worker/secrets/firebase-service-account.json` สร้างโฟลเดอร์ `secrets` ก่อนถ้ายังไม่มี
6. ตรวจใน [Google Cloud IAM](https://console.cloud.google.com/iam-admin/iam) ของโปรเจกต์เดียวกันว่าบัญชีบริการใน JSON มีสิทธิ์จัดการ Authentication เช่น **Firebase Authentication Admin** (`roles/firebaseauth.admin`) ถ้ามีสิทธิ์นี้อยู่แล้วไม่ต้องเพิ่ม

นักเรียนใช้รหัสนักเรียน เช่น `00123` เข้าเว็บ ระบบแมปกับบัญชีภายในโดยอัตโนมัติ นักเรียนไม่ต้องมีอีเมล ไม่ต้องสร้างบัญชีเด็กใน Firebase Console ด้วยตนเอง ครูเพิ่มจากเว็บได้

ค่า `apiKey` ใช้เรียก Identity Toolkit API จากเซิร์ฟเวอร์ หากตั้งข้อจำกัด API ให้อนุญาต Identity Toolkit API อย่าจำกัดด้วย HTTP referrer ของเบราว์เซอร์ เพราะคำขอออกจาก Worker ไม่ได้ออกจากหน้าเว็บ

## 2. สร้าง Google OAuth สำหรับ Drive ของครู

1. เปิด [Google Cloud Console](https://console.cloud.google.com/) เลือกโปรเจกต์ Firebase เดียวกัน
2. ไปที่ **APIs & Services → Library** เปิด **Google Drive API**
3. เปิด **Google Auth Platform** แล้วตั้งค่า Branding: ชื่อแอป `Sabai Learn`, อีเมลติดต่อของครู และอีเมลผู้พัฒนา
4. Audience เลือก **External** หากใช้ Gmail ส่วนตัว ช่วงทดลองเพิ่มอีเมลครูเป็น Test user นักเรียนไม่ต้องเป็น Test user เพราะไม่ได้เชื่อม Drive ด้วย Google ของตนเอง
5. Data Access เพิ่มเฉพาะ `https://www.googleapis.com/auth/drive.file` ตาม [สิทธิ์ Drive ที่ใช้กับไฟล์ของแอป](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
6. Clients → Create client → **Web application** แล้วเพิ่ม Authorized redirect URI สำหรับทดลอง:

   ```text
   http://127.0.0.1:5173/api/admin/drive/callback
   ```

7. บันทึก **Client ID** และ **Client secret** ไว้ใช้ในขั้นตอน 3 เพิ่ม URI ของเว็บออนไลน์อีกอัน:

   ```text
   https://sabai-learn.natthaphan.workers.dev/api/admin/drive/callback
   ```

8. ก่อนใช้จริง เปลี่ยนสถานะ OAuth จาก Testing เป็น **In production** ตามขั้นตอนที่ Console แสดง และเพิ่ม URL หน้าแรกกับ `/privacy` ของเว็บ Google ระบุว่า refresh token ของแอป External ใน Testing ที่ขอสิทธิ์ Drive จะหมดอายุใน 7 วัน จึงเหมาะกับการทดลองระยะสั้นเท่านั้น ([อายุโทเคน](https://developers.google.com/identity/protocols/oauth2#expiration)) หาก Console ขอข้อมูลเพิ่มเติม ให้ทำให้ครบก่อนเปิดใช้งาน

ครูจะกดอนุญาต Google จากหน้าตั้งค่าของเว็บเอง แอปสร้างโฟลเดอร์ `Sabai Learn` และโฟลเดอร์แยกห้อง ไฟล์ยังเป็นส่วนตัว นักเรียนเปิดผ่านเว็บหลังตรวจสิทธิ์

## 3. ใส่ค่าตั้งค่าในเครื่อง

เปิด Terminal ที่ `D:\Codex\Sabai Learn`:

```powershell
Copy-Item backend-worker/setup.config.example.json backend-worker/setup.config.json
New-Item -ItemType Directory -Force backend-worker/secrets
```

เปิด `backend-worker/setup.config.json` แล้วเติม:

| ช่อง | ค่า |
| --- | --- |
| `firebaseApiKey` | `apiKey` ของ Web app จาก Firebase |
| `firebaseServiceAccountFile` | `secrets/firebase-service-account.json` |
| `googleOAuthClientId` | OAuth Client ID หรือเว้นว่างเมื่อยังไม่เชื่อม Drive |
| `googleOAuthClientSecret` | OAuth Client secret หรือเว้นว่างเมื่อยังไม่เชื่อม Drive |
| `localOrigin` | `http://127.0.0.1:5173` |

เก็บ JSON บัญชีบริการตามช่องที่กำหนด จากนั้นรัน:

```powershell
node backend-worker/scripts/configure.mjs
```

ตัวช่วยจะสร้าง `.dev.vars` สำหรับเครื่องนี้ และ `secrets/worker-secrets.json` สำหรับเปิดออนไลน์ พร้อมสร้างกุญแจเข้ารหัส Drive และกุญแจสร้างครูโดยไม่พิมพ์ค่าบนหน้าจอ ถ้ายังไม่มี Google OAuth ให้เว้นทั้งสองช่องไว้ หรือคงข้อความตัวอย่างไว้ เมื่อพร้อมแล้วเติมทั้งคู่และรันตัวช่วยอีกครั้ง ค่ากุญแจเดิมจะคงอยู่

เก็บสำรอง `worker-secrets.json` อย่างปลอดภัย โดยเฉพาะ `DRIVE_TOKEN_ENCRYPTION_KEY` ต้องใช้ค่าเดิมเพื่ออ่านโทเคน Drive ที่เข้ารหัสไว้

ไฟล์กุญแจ ค่าตั้งค่าจริง และข้อมูลสำรองถูกกันออกจาก Git อย่าอัปโหลดไฟล์เหล่านี้หรือคัดลอกเข้าแชต ตัวแปร `VITE_*` ไม่ควรมีความลับ

## 4. ทดลองกับบริการจริงในเครื่อง

ถ้ายังไม่ได้ติดตั้งส่วนประกอบ ให้รัน `npm ci` ที่โฟลเดอร์หลัก และ `npm ci` ที่ `backend-worker` ก่อน โดยใช้ Node.js 24 ขึ้นไป

สร้างโครงสร้างฐานข้อมูล **ในเครื่อง**:

```powershell
node backend-worker/scripts/local.mjs migrate
npm run build
npm run dev:api
```

เปิด Terminal อีกหน้าที่โฟลเดอร์หลัก:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

ใช้ `127.0.0.1` ให้เหมือนกันตลอด ไม่สลับเป็น `localhost` เพื่อให้ที่อยู่เว็บ คุกกี้ และ OAuth ตรงกัน

เปิด Terminal อีกหน้าเพื่อสร้างครูครั้งแรก:

```powershell
node backend-worker/scripts/setup.mjs
```

กรอก URL `http://127.0.0.1:5173` ชื่อเข้าใช้ เช่น `teacher` ชื่อครู และรหัสผ่านเริ่มต้นอย่างน้อย 8 ตัวอักษร ตัวช่วยจะซ่อนรหัสผ่านบนจอ มีครูผู้ดูแลได้หนึ่งบัญชี เมื่อสร้างแล้วจะเรียกขั้นตอนนี้ซ้ำไม่ได้

เข้าเว็บด้วยบัญชีครู เปลี่ยนรหัสผ่านครั้งแรก แล้วเข้าสู่ระบบใหม่ เปิด **ตั้งค่า → เชื่อม Google Drive** และอนุญาตด้วยบัญชี Google ของครู ใส่ชื่อครู ลิงก์ LINE (`line.me` หรือ `lin.ee`) และเวลาติดต่อ

ฐานข้อมูลในเครื่องแยกจากออนไลน์ แต่ไฟล์ที่ส่งในขั้นตอนนี้ใช้ Drive จริง จึงควรแยกโปรเจกต์ Firebase/OAuth และบัญชี Drive สำหรับทดสอบถ้าต้องการไม่ปะปนกับข้อมูลจริง

## 5. เปิดออนไลน์บน workers.dev

ใช้บัญชี Cloudflare Free เปิด **Workers & Pages** และตั้งชื่อ subdomain `workers.dev` ไม่มีการซื้อโดเมนในขั้นตอนนี้ ตรวจโควตาจาก [Workers](https://developers.cloudflare.com/workers/platform/limits/) และ [D1](https://developers.cloudflare.com/d1/platform/limits/) บริการจะหยุดคำขอที่เกินข้อจำกัด ไม่มีโค้ดเปลี่ยนเป็นแผนเสียเงินอัตโนมัติ

จากโฟลเดอร์หลัก สร้างเว็บก่อน:

```powershell
npm run check
npm run build
Set-Location backend-worker
$env:WRANGLER_LOG_PATH = Join-Path $PWD '.wrangler/logs'
$env:WRANGLER_SEND_METRICS = 'false'
npx wrangler login --scopes account:read user:read workers_scripts:write d1:write
npx wrangler whoami
npx wrangler d1 list
```

`login` จะเปิดเบราว์เซอร์ ให้ผู้ดูแลเข้าสู่ระบบและอนุญาตด้วยตนเอง

โปรเจกต์นี้ใช้ Worker เดิมชื่อ `sabai-learn` ในบัญชี `c8e33286bed73fdebccd00dec803262b` และ D1 เดิมชื่อ `sabailearn`, ID `6b6eb4a1-7e57-40ec-ac78-9f0752857abb` ให้ **สำรองก่อนเพิ่มโครงสร้าง**:

```powershell
New-Item -ItemType Directory -Force backups
npx wrangler d1 export sabailearn --remote --output "backups/before-classroom-$(Get-Date -Format yyyyMMdd-HHmmss).sql"
```

ตรวจว่ามีไฟล์สำรองและคำสั่งสำเร็จ จึงไปต่อ ถ้าคำสั่งล้มเหลวให้แก้ก่อน ไม่ข้ามการสำรอง

ตรวจว่ากำลังเลือกบัญชีและฐานข้อมูลข้างต้นจริง แล้วเพิ่มตารางและเปิดเว็บ:

```powershell
npx wrangler d1 migrations apply sabailearn --remote
npx wrangler deploy
npx wrangler secret bulk secrets/worker-secrets.json
```

Migration เพิ่มตารางชื่อ `sl_` และไม่ลบตารางเดิม ข้อมูลจำลองกับ localStorage ไม่ถูกนำไปฐานข้อมูลจริง การ deploy ครั้งแรกยังไม่มีค่าบัญชีผู้ใช้จนกว่า `secret bulk` จะสำเร็จ

บันทึก URL HTTPS ที่ Cloudflare แสดง เพิ่ม callback URI ของ URL นี้ใน Google OAuth ตามขั้นตอน 2 อย่าตั้ง `APP_ORIGIN` ของออนไลน์เป็น URL ในเครื่อง ค่าออนไลน์จะใช้โดเมนของคำขอเดียวกัน

URL ของเว็บนี้คือ `https://sabai-learn.natthaphan.workers.dev` ตั้ง Google OAuth callback เป็น `https://sabai-learn.natthaphan.workers.dev/api/admin/drive/callback` ใน Workers Builds ใช้ Build command `npm run build`, Deploy command `npm run deploy`, Version command `npm run deploy:preview` และ Root directory `/` เพื่อให้ใช้ไฟล์ตั้งค่าเดียวกับการ deploy จากเครื่อง

สร้างบัญชีครูออนไลน์แยกจากบัญชีในเครื่อง:

```powershell
node scripts/setup.mjs
```

กรอก URL `https://…workers.dev` แล้วเข้าเว็บเปลี่ยนรหัสผ่าน เชื่อม Drive และตั้ง LINE จากหน้าเว็บออนไลน์ การเชื่อม Drive ในเครื่องไม่ถูกคัดลอกมาออนไลน์

## 6. เตรียมห้องก่อนให้นักเรียนใช้

1. สร้างห้องตามปีการศึกษา ภาคเรียน ชั้น ห้อง และคณิตศาสตร์พื้นฐาน/เพิ่มเติม ภาคใหม่ให้สร้างห้องใหม่เพื่อเก็บประวัติเดิม
2. เพิ่มรายชื่อด้วยรหัสนักเรียนแบบข้อความ เลขศูนย์นำหน้าจะอยู่ครบ จัดนักเรียนเข้าห้อง และมอบรหัสผ่านเริ่มต้นเป็นรายคน
3. เพิ่มคาบตามวันจริง เลือกโครงร่างคณิตศาสตร์เดิมได้ แต่ต้องเติมคำอธิบาย คลิป และใบงานของคาบก่อนเผยแพร่
4. เพิ่มงาน กิจกรรม และคะแนนสอบ ระบุคะแนนเต็มแต่ละรายการ งานที่รับส่งต้องมีกำหนดส่ง สามารถเผยแพร่ทีหลังได้
5. ทดลองนักเรียนสองคนต่างห้อง: เปลี่ยนรหัส ส่งงาน ดาวน์โหลดใบงาน และเปิด LINE ตรวจว่าดูข้อมูลของอีกคนไม่ได้
6. ทดลองครูรับงานกระดาษ ให้คะแนน 0 ล้างคะแนน เปิดรับแก้ไข ปิดบัญชี และคืนบัญชี ตรวจประวัติหลังคืนบัญชี

คะแนนเก็บ = คะแนนที่ได้รวม ÷ คะแนนเต็มของงานและกิจกรรมที่เผยแพร่รวม × 60 กลางภาคและปลายภาคใช้สูตรเดียวกันแต่คูณ 20 รายการที่ยังไม่กรอกมีป้ายแยกจาก 0 ผลรวมระหว่างภาคเป็นคะแนนปัจจุบัน การเผยแพร่รายการใหม่จะเปลี่ยนสัดส่วน

รับ PDF, DOC, DOCX, JPG, PNG และ WebP ไม่เกิน 10 MB ต่อไฟล์ ถ้าอัปโหลดไม่ครบ ระบบจะไม่บันทึกว่ารับงานแล้ว เมื่อ Drive เต็มหรือบริการจำกัดโควตา ให้แก้สาเหตุและส่งใหม่ งานที่ตรวจแล้วต้องให้ครูเปิดรับแก้ไขก่อน

## ทดลองหน้าตาโดยยังไม่สร้างบัญชีบริการ

ระบบทดสอบนี้ใช้บัญชีและไฟล์จำลองเฉพาะในหน่วยความจำของเครื่อง ไม่มีการเรียก Google จริง และไม่ถูกนำไป deploy ทุกหน้าที่เข้าสู่ระบบมีป้ายข้อมูลทดสอบ เมื่อปิดตัวทดสอบข้อมูลจะหาย

Terminal แรกที่โฟลเดอร์หลัก:

```powershell
npm run qa:api
```

Terminal อีกหน้า:

```powershell
$env:SABAI_API_PORT = '8788'
npm run dev -- --host 127.0.0.1 --port 5174
```

เปิด [เว็บทดสอบในเครื่อง](http://127.0.0.1:5174/login):

| บัญชีจำลอง | ชื่อเข้าใช้ | รหัสผ่าน |
| --- | --- | --- |
| ครู | `teacher` | `TeacherNew456` |
| นักเรียนห้อง 1 | `00123` | `StudentPreview123` |
| นักเรียนห้อง 2 | `00456` | `StudentPreview456` |

รหัสเหล่านี้ใช้กับตัวทดสอบเท่านั้น การบังคับเปลี่ยนรหัสผ่านครั้งแรกของบัญชีจริงยังทำงาน และทดสอบแยกใน `npm run check`

## สถานะการตรวจสอบ

`npm run check` ตรวจ API ด้วยฐานข้อมูล SQLite ในเครื่องและตัวจำลอง Firebase/Drive ครอบคลุมสิทธิ์ บัญชี คะแนน การส่งงาน และความล้มเหลวการอัปโหลด `npm run build` ตรวจการสร้างหน้าเว็บ การตรวจนี้ยังไม่ยืนยันการเชื่อม Firebase/Google จริงหรือการเปิดบน Cloudflare ต้องตรวจซ้ำหลังตั้งค่าบัญชีครบ

ตรวจ runtime ของ Worker และ migration ในเครื่องแล้ว การตรวจ lint รันสำเร็จโดยไม่มี error แต่ยังมีคำเตือนในโค้ดเก่าและการอัปเดตหน้าจอ React ระหว่างพัฒนา
