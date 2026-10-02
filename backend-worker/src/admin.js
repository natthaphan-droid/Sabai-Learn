import { HttpError, requireThat, textValue, usernameValue, passwordValue, numberValue, dateValue, dueValue, videoValue, contactValue } from './domain.js';
import { sql, first, run, json, readBody, accessClass, accessLesson, accessItem, enrolledStudent, newAccount, assignClasses, adminOverview, saveSetting, nowISO } from './data.js';
import { updateIdentity } from './integrations.js';
import { handleDrive } from './files.js';
export async function handleAdmin(request, env, user, url) {
  const path = url.pathname;
  if (path.startsWith('/api/admin/drive/')) return handleDrive(request, env, user, url);
  if (path === '/api/admin/overview' && request.method === 'GET') return json(await adminOverview(env));
  if (path === '/api/admin/students/import' && request.method === 'POST') {
    const data = await readBody(request), username = usernameValue(data.username), name = textValue(data.name, 'ชื่อนักเรียน', 150);
    const classroom = await accessClass(env, user, data.classId);
    requireThat(classroom.active, 'ห้องเรียนนี้ปิดอยู่');
    const existing = await first(env, 'SELECT * FROM sl_users WHERE username=?', username);
    if (existing) {
      requireThat(existing.role === 'student' && existing.active, 'บัญชีนี้ไม่ใช่นักเรียนที่เปิดใช้งาน', 409);
      requireThat(existing.name.replace(/\s+/g, '') === name.replace(/\s+/g, ''), 'รหัสนักเรียนนี้มีชื่อไม่ตรงกับบัญชีเดิม กรุณาตรวจรายชื่อ', 409);
      await run(env, 'INSERT INTO sl_enrollments(class_id,user_id,active) VALUES(?,?,1) ON CONFLICT(class_id,user_id) DO UPDATE SET active=1', data.classId, existing.id);
      return json({ created: false });
    }
    await newAccount(env, { username, name, password: data.password, classIds: [data.classId] }, 'student');
    return json({ created: true }, 201);
  }
  if (path === '/api/admin/students' && request.method === 'POST') {
    const data = await readBody(request);
    requireThat(Array.isArray(data.classIds) && data.classIds.length <= 50 && data.classIds.every(id => typeof id === 'string'), 'กรุณาเลือกห้องเรียนไม่เกิน 50 ห้อง');
    for (const id of data.classIds) await accessClass(env, user, id);
    const student = await newAccount(env, { ...data, classIds: [...new Set(data.classIds)] }, 'student');
    return json({ student }, 201);
  }
  const studentMatch = path.match(/^\/api\/admin\/students\/([^/]+)(?:\/(password))?$/);
  if (studentMatch && request.method === 'PUT') {
    const student = await first(env, "SELECT * FROM sl_users WHERE id=? AND role='student'", studentMatch[1]);
    requireThat(student, 'ไม่พบนักเรียน', 404);
    const data = await readBody(request);
    if (studentMatch[2] === 'password') {
      await updateIdentity(env, student.id, { password: passwordValue(data.password) });
      await env.DB.batch([sql(env, 'UPDATE sl_users SET must_change=1 WHERE id=?', student.id), sql(env, 'DELETE FROM sl_sessions WHERE user_id=?', student.id)]);
    } else if (typeof data.active === 'boolean') {
      if (!data.active) await env.DB.batch([sql(env, 'UPDATE sl_users SET active=0 WHERE id=?', student.id), sql(env, 'DELETE FROM sl_sessions WHERE user_id=?', student.id)]);
      await updateIdentity(env, student.id, { disableUser: !data.active });
      if (data.active) await run(env, 'UPDATE sl_users SET active=1 WHERE id=?', student.id);
    } else {
      const name = textValue(data.name, 'ชื่อนักเรียน', 150);
      await assignClasses(env, student.id, data.classIds);
      await run(env, 'UPDATE sl_users SET name=? WHERE id=?', name, student.id);
    }
    return json({ ok: true });
  }
  const classMatch = path.match(/^\/api\/admin\/classes(?:\/([^/]+))?$/);
  if (classMatch && ['POST','PUT'].includes(request.method)) {
    const data = await readBody(request), id = classMatch[1] || crypto.randomUUID();
    if (classMatch[1]) await accessClass(env, user, id);
    const title = textValue(data.title, 'ชื่อรายวิชา', 150), grade = textValue(data.grade, 'ระดับชั้น', 30), room = textValue(data.room, 'ห้อง', 30), year = textValue(data.year, 'ปีการศึกษา', 10), term = numberValue(data.term, 1, 2, 'ภาคเรียน');
    requireThat(Number.isInteger(term) && ['basic','additional'].includes(data.subject), 'รายวิชาไม่ถูกต้อง');
    await run(env, 'INSERT INTO sl_classes(id,title,grade,room,year,term,subject,active) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,grade=excluded.grade,room=excluded.room,year=excluded.year,term=excluded.term,subject=excluded.subject,active=excluded.active', id, title, grade, room, year, term, data.subject, data.active === false ? 0 : 1);
    return json({ id });
  }
  const lessonMatch = path.match(/^\/api\/admin\/lessons(?:\/([^/]+))?$/);
  if (lessonMatch && ['POST','PUT'].includes(request.method)) {
    const data = await readBody(request), id = lessonMatch[1] || crypto.randomUUID();
    await accessClass(env, user, data.classId);
    if (lessonMatch[1]) requireThat((await accessLesson(env, user, id)).class_id === data.classId, 'เปลี่ยนห้องของคาบเดิมไม่ได้');
    await run(env, 'INSERT INTO sl_lessons(id,class_id,title,lesson_date,notes,video_url,published) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,lesson_date=excluded.lesson_date,notes=excluded.notes,video_url=excluded.video_url,published=excluded.published', id, data.classId, textValue(data.title, 'หัวข้อคาบเรียน', 200), dateValue(data.date), textValue(data.notes || '', 'เนื้อหา', 20000, true), videoValue(data.videoUrl), data.published ? 1 : 0);
    return json({ id });
  }
  const itemMatch = path.match(/^\/api\/admin\/items(?:\/([^/]+))?$/);
  if (itemMatch && ['POST','PUT'].includes(request.method)) {
    const data = await readBody(request), id = itemMatch[1] || crypto.randomUUID();
    await accessClass(env, user, data.classId);
    if (itemMatch[1]) requireThat((await accessItem(env, user, id)).class_id === data.classId, 'เปลี่ยนห้องของงานเดิมไม่ได้');
    if (data.lessonId) requireThat((await accessLesson(env, user, data.lessonId)).class_id === data.classId, 'คาบเรียนอยู่คนละห้อง');
    requireThat(['coursework','midterm','final'].includes(data.category), 'หมวดคะแนนไม่ถูกต้อง');
    const maximum = numberValue(data.maxScore, 0.01, 100000, 'คะแนนเต็ม');
    requireThat(!await first(env, 'SELECT 1 FROM sl_scores WHERE item_id=? AND score>?', id, maximum), 'คะแนนเต็มต่ำกว่าคะแนนที่กรอกไว้');
    const accepts = data.category === 'coursework' && data.acceptsSubmission ? 1 : 0, due = dueValue(data.dueAt);
    requireThat(!accepts || due, 'กรุณากำหนดวันส่งงาน');
    await run(env, 'INSERT INTO sl_items(id,class_id,lesson_id,title,description,category,max_score,accepts_submission,due_at,published) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET lesson_id=excluded.lesson_id,title=excluded.title,description=excluded.description,category=excluded.category,max_score=excluded.max_score,accepts_submission=excluded.accepts_submission,due_at=excluded.due_at,published=excluded.published', id, data.classId, data.lessonId || null, textValue(data.title, 'ชื่องาน', 200), textValue(data.description || '', 'รายละเอียด', 10000, true), data.category, maximum, accepts, due, data.published ? 1 : 0);
    return json({ id });
  }
  if (path === '/api/admin/score' && request.method === 'PUT') {
    const data = await readBody(request), item = await accessItem(env, user, data.itemId);
    await enrolledStudent(env, item.class_id, data.studentId);
    const commands = [];
    if (data.receivedPaper) {
      requireThat(item.accepts_submission, 'รายการนี้ไม่ใช่งานส่ง');
      commands.push(sql(env, "INSERT INTO sl_submissions(id,item_id,user_id,mode,note,submitted_at,revision) VALUES(?,?,?,'paper','',?,?) ON CONFLICT(item_id,user_id) DO UPDATE SET mode='paper',submitted_at=excluded.submitted_at,reopened=0,revision=excluded.revision", crypto.randomUUID(), item.id, data.studentId, nowISO(), crypto.randomUUID()));
      commands.push(sql(env, 'DELETE FROM sl_submission_files WHERE submission_id IN (SELECT id FROM sl_submissions WHERE item_id=? AND user_id=?)', item.id, data.studentId));
    }
    const received = data.receivedPaper || await first(env, 'SELECT id FROM sl_submissions WHERE item_id=? AND user_id=? AND reopened=0', item.id, data.studentId);
    requireThat(data.score === null || !item.accepts_submission || received, 'บันทึกรับงานกระดาษหรือรอนักเรียนส่งก่อนให้คะแนน');
    if (data.score === null) commands.push(sql(env, 'DELETE FROM sl_scores WHERE item_id=? AND user_id=?', item.id, data.studentId));
    else commands.push(sql(env, 'INSERT INTO sl_scores(item_id,user_id,score,feedback,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(item_id,user_id) DO UPDATE SET score=excluded.score,feedback=excluded.feedback,updated_at=excluded.updated_at', item.id, data.studentId, numberValue(data.score, 0, item.max_score, 'คะแนน'), textValue(data.feedback || '', 'ข้อเสนอแนะ', 2000, true), nowISO()));
    await env.DB.batch(commands);
    return json({ ok: true });
  }
  if (path === '/api/admin/reopen' && request.method === 'PUT') {
    const data = await readBody(request), item = await accessItem(env, user, data.itemId);
    await enrolledStudent(env, item.class_id, data.studentId);
    requireThat(item.accepts_submission && await first(env, 'SELECT id FROM sl_submissions WHERE item_id=? AND user_id=?', item.id, data.studentId), 'ยังไม่มีงานที่ส่ง');
    await env.DB.batch([sql(env, 'DELETE FROM sl_scores WHERE item_id=? AND user_id=?', item.id, data.studentId), sql(env, 'UPDATE sl_submissions SET reopened=1 WHERE item_id=? AND user_id=?', item.id, data.studentId)]);
    return json({ ok: true });
  }
  if (path === '/api/admin/followup' && request.method === 'PUT') {
    const data = await readBody(request);
    await enrolledStudent(env, data.classId, data.studentId);
    if (data.flagged) await run(env, 'INSERT INTO sl_followups(class_id,user_id,note,updated_at) VALUES(?,?,?,?) ON CONFLICT(class_id,user_id) DO UPDATE SET note=excluded.note,updated_at=excluded.updated_at', data.classId, data.studentId, textValue(data.note || '', 'หมายเหตุ', 2000, true), nowISO());
    else await run(env, 'DELETE FROM sl_followups WHERE class_id=? AND user_id=?', data.classId, data.studentId);
    return json({ ok: true });
  }
  if (path === '/api/admin/contact' && request.method === 'PUT') { await saveSetting(env, 'contact', contactValue(await readBody(request))); return json({ ok: true }); }
  throw new HttpError(404, 'ไม่พบคำขอ');
}
