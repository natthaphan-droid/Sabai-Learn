import test from 'node:test';
import assert from 'node:assert/strict';
import { utils, write } from 'xlsx';
import { readRoster, rosterRows } from '../../src/lib/roster.js';
import { passwordValue } from '../src/domain.js';
import { environment, seed } from './helpers.mjs';

test('Excel roster preserves identifiers, reads repeated school headers and rejects duplicate or formula identifiers', () => {
  const title = room => `รายชื่อนักเรียน ชั้นมัธยมศึกษาปีที่ 4/${room} ภาคเรียนที่ 2 ปีการศึกษา 2568`;
  const sheet = utils.aoa_to_sheet([[title(1)], ['ที่', 'เลขฯ', 'ชื่อ - สกุล'], [1, '00123', 'นักเรียน หนึ่ง'], [2, 456, 'นักเรียน สอง'], [], [title(2)], ['ที่', 'เลขฯ', 'ชื่อ - สกุล'], [1, '00789', 'นักเรียน สาม']]);
  sheet.B4.z = '00000';
  const workbook = utils.book_new(); utils.book_append_sheet(workbook, sheet, 'ม.4');
  const parsed = readRoster(write(workbook, { type: 'array', bookType: 'xlsx' }))[0];
  const options = { ...parsed, fromFile: true };
  const rows = rosterRows(parsed, options);
  assert.deepEqual(rows.map(r => r.username), ['00123', '00456', '00789']);
  assert.deepEqual(rows.map(r => r.classroom.room), ['1', '1', '2']);
  assert.equal(rows[2].classroom.year, '2568');
  parsed.rows[7][1] = '00123'; assert.throws(() => rosterRows(parsed, options), /ซ้ำ/);
  parsed.rows[7][1] = '00789'; parsed.formulas.add('B8'); assert.throws(() => rosterRows(parsed, options), /สูตร/);
  assert.throws(() => passwordValue('1234567'));
  assert.equal(passwordValue('12345678'), '12345678');
});

test('roster import creates accounts, forces first password change and preserves existing memberships and passwords', async () => {
  const fixture = environment(), originalFetch = globalThis.fetch; globalThis.fetch = fixture.provider;
  try {
    const f = await seed(fixture), { call, database, state } = fixture;
    const body = { username: '00001', name: 'นักเรียน นำเข้า', password: '12345678', classId: f.classA };
    assert.equal((await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body: { ...body, password: '1234567' } })).status, 400);
    assert.equal(database.prepare('SELECT id FROM sl_users WHERE username=?').get('00001'), undefined);
    const imported = await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body });
    assert.equal(imported.status, 201); assert.equal(imported.data.created, true);
    const login = await call('/auth/login', { method: 'POST', body: { username: '00001', password: '12345678' } });
    assert.equal(login.status, 200); assert.equal(login.data.user.mustChange, true);
    assert.equal((await call('/overview', { cookie: login.cookie })).status, 428);
    assert.equal((await call('/auth/password', { method: 'PUT', cookie: login.cookie, body: { currentPassword: '12345678', password: '12345678' } })).status, 400);
    assert.equal((await call('/auth/password', { method: 'PUT', cookie: login.cookie, body: { currentPassword: '12345678', password: 'NewPass8' } })).status, 200);
    assert.equal((await call('/auth/me', { cookie: login.cookie })).status, 401);
    const session = await call('/auth/login', { method: 'POST', body: { username: '00001', password: 'NewPass8' } });
    assert.equal((await call('/admin/students/import', { method: 'POST', cookie: session.cookie, body })).status, 403);
    const repeated = await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body: { ...body, classId: f.classB } });
    assert.equal(repeated.status, 200); assert.equal(repeated.data.created, false);
    assert.equal(database.prepare('SELECT COUNT(*) AS n FROM sl_enrollments WHERE user_id=? AND active=1').get(login.data.user.id).n, 2);
    assert.equal((await call('/auth/login', { method: 'POST', body: { username: '00001', password: 'NewPass8' } })).status, 200);
    assert.equal((await call('/auth/login', { method: 'POST', body: { username: '00001', password: '12345678' } })).status, 401);
    assert.equal((await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body: { ...body, name: 'ชื่ออื่น' } })).status, 409);
    assert.equal((await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body: { ...body, username: 'teacher' } })).status, 409);
    assert.equal((await call(`/admin/students/${login.data.user.id}/password`, { method: 'PUT', cookie: f.teacherCookie, body: { password: '12345678' } })).status, 200);
    assert.equal((await call('/auth/me', { cookie: session.cookie })).status, 401);
    const reset = await call('/auth/login', { method: 'POST', body: { username: '00001', password: '12345678' } });
    assert.equal(reset.data.user.mustChange, true);
    const count = state.identities.size;
    const originalBatch = fixture.env.DB.batch;
    fixture.env.DB.batch = () => { throw new Error('simulated D1 failure'); };
    assert.equal((await call('/admin/students/import', { method: 'POST', cookie: f.teacherCookie, body: { ...body, username: '00002' } })).status, 500);
    fixture.env.DB.batch = originalBatch;
    assert.equal(state.identities.size, count);
    assert.equal(database.prepare('SELECT id FROM sl_users WHERE username=?').get('00002'), undefined);
  } finally { globalThis.fetch = originalFetch; fixture.database.close(); }
});
