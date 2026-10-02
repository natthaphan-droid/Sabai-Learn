import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { api } from '../lib/api';
import { readRoster, rosterRows, downloadRoster } from '../lib/roster';
import { Button } from './ui/Button';
import { Field, Notice, classLabel } from './ClassroomUI';

export default function RosterImport({ data, onBusy, onSaved }) {
  const [sheets, setSheets] = useState([]), [sheetIndex, setSheetIndex] = useState(0), [mapping, setMapping] = useState({ headerRow: 0, idColumn: 0, nameColumn: 1, lastNameColumn: -1 });
  const [mode, setMode] = useState('new'), [classId, setClassId] = useState(data.classes.find(c => c.active)?.id || ''), [fromFile, setFromFile] = useState(false);
  const [room, setRoom] = useState({ grade: 'ม.4', room: '1', year: String(new Date().getFullYear() + 543), term: 2, subject: 'basic' });
  const [results, setResults] = useState([]), [busy, setBusy] = useState(false), [error, setError] = useState(''), [complete, setComplete] = useState(false);
  const sheet = sheets[sheetIndex];
  let rows = [], validation = '';
  if (sheet) { try { rows = rosterRows(sheet, { ...mapping, fromFile: mode === 'new' && fromFile }); } catch (failure) { validation = failure.message; } }
  const groups = [...new Map(rows.map(r => [r.classroom ? `${r.classroom.grade}/${r.classroom.room}` : 'selected', r.classroom])).values()];
  const changeRoom = (key, value) => setRoom(previous => ({ ...previous, [key]: value }));
  function selectSheet(index, available = sheets) {
    const s = available[index]; setSheetIndex(index); setMapping({ headerRow: s.headerRow, idColumn: s.idColumn, nameColumn: s.nameColumn, lastNameColumn: -1 });
  }
  async function chooseFile(event) {
    const file = event.target.files[0]; setError(''); setSheets([]); setResults([]); setComplete(false);
    if (!file) return;
    try {
      if (!/\.(xlsx|csv)$/i.test(file.name) || file.size > 2 * 1024 * 1024) throw new Error('ใช้ Excel (.xlsx) หรือ CSV ไม่เกิน 2 MB');
      const available = readRoster(await file.arrayBuffer()); setSheets(available); selectSheet(0, available);
      let first;
      try { first = rosterRows(available[0], { ...available[0], fromFile: true })[0]; } catch { /* A plain roster can use the room selected by the teacher. */ }
      setFromFile(Boolean(first)); setMode('new'); if (first) setRoom(previous => ({ ...previous, ...first.classroom }));
    } catch (failure) { setError(failure.message); }
  }
  async function start(event) {
    event.preventDefault(); setError(''); setBusy(true); onBusy(true);
    const pending = results.length ? [...results] : rows.map(r => ({ ...r, password: '12345678', status: 'รอนำเข้า' }));
    setResults([...pending]);
    try {
      const title = room.subject === 'basic' ? 'คณิตศาสตร์พื้นฐาน' : 'คณิตศาสตร์เพิ่มเติม';
      const classes = (await api('/admin/overview')).classes;
      for (let i = 0; i < pending.length; i++) {
        const row = pending[i]; if (row.done) continue;
        const target = { ...room, ...(fromFile && mode === 'new' ? { grade: row.classroom.grade, room: row.classroom.room } : {}), title };
        let targetId = row.classId || (mode === 'existing' ? classId : classes.find(c => c.active && ['grade','room','year','term','subject'].every(key => String(c[key]) === String(target[key])))?.id);
        if (!targetId) { targetId = (await api('/admin/classes', { method: 'POST', body: target })).id; classes.push({ ...target, id: targetId, active: 1 }); }
        row.classId = targetId; row.roomLabel = classLabel(classes.find(c => c.id === targetId)); row.status = 'กำลังสร้างบัญชี'; setResults([...pending]);
        try {
          const result = await api('/admin/students/import', { method: 'POST', body: { username: row.username, name: row.name, password: row.password, classId: targetId } });
          row.created = result.created; row.done = true; row.status = result.created ? 'สร้างบัญชีแล้ว' : 'ใช้บัญชีเดิม';
        } catch (failure) { row.status = `ยังไม่สำเร็จ: ${failure.message}`; throw failure; }
        setResults([...pending]);
      }
      setComplete(true);
    } catch (failure) { setError(`${failure.message} รายการที่สำเร็จยังอยู่ กดนำเข้าต่อเพื่อทำเฉพาะรายการที่เหลือ หากบัญชีถูกสร้างก่อนการเชื่อมต่อขาด ให้รีเซ็ตรหัสจากรายชื่อนักเรียน`); }
    finally { setResults([...pending]); try { await onSaved(); } finally { setBusy(false); onBusy(false); } }
  }
  const download = () => downloadRoster('บัญชีนักเรียน-Sabai-Learn.xlsx', [['ชื่อเข้าใช้','ชื่อ–นามสกุล','ห้องเรียน','รหัสผ่านเริ่มต้น','ผลการนำเข้า'], ...results.filter(r => r.done).map(r => [r.username, r.name, r.roomLabel, r.created ? r.password : '', r.status])]);
  return <div className="space-y-4"><p className="text-sm leading-7 text-textSecondary">ใช้เลขประจำตัวนักเรียนเป็นชื่อเข้าใช้ รหัสผ่านเริ่มต้น 12345678 นักเรียนต้องเปลี่ยนก่อนเข้าห้องเรียน บัญชีเดิมใช้รหัสเดิมและยังอยู่ในห้องเดิมด้วย</p><Notice>{error || validation}</Notice>
    <form onSubmit={start} className="space-y-4"><fieldset disabled={busy || results.length > 0} className="space-y-4">
      <Field label="ไฟล์รายชื่อนักเรียน" hint="Excel (.xlsx) หรือ CSV ไม่เกิน 2 MB เก็บรหัสเป็นข้อความเพื่อรักษาศูนย์นำหน้า"><input type="file" accept=".xlsx,.csv" required className="form-input" onChange={chooseFile} /></Field>
      <Button type="button" variant="outline" onClick={() => downloadRoster('แม่แบบรายชื่อนักเรียน.xlsx', [['รหัสนักเรียน','ชื่อ–นามสกุล']])}><Download size={16} />ดาวน์โหลดแม่แบบ Excel</Button>
      {sheet && <><Field label="แผ่นงาน"><select className="form-input" value={sheetIndex} onChange={event => selectSheet(Number(event.target.value))}>{sheets.map((s, i) => <option key={i} value={i}>{s.name}</option>)}</select></Field><Field label="แถวหัวตาราง"><input type="number" className="form-input" min={1} max={sheet.rows.length} value={mapping.headerRow + 1} onChange={event => setMapping({ ...mapping, headerRow: Number(event.target.value) - 1 })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">{[['idColumn','คอลัมน์รหัสนักเรียน'],['nameColumn','คอลัมน์ชื่อ / ชื่อ–นามสกุล'],['lastNameColumn','คอลัมน์นามสกุล (ถ้าแยกไว้)']].map(([key, label]) => <Field key={key} label={label}><select className="form-input" value={mapping[key]} onChange={event => setMapping({ ...mapping, [key]: Number(event.target.value) })}>{key === 'lastNameColumn' && <option value={-1}>ชื่อและนามสกุลอยู่คอลัมน์เดียวกัน</option>}{(sheet.rows[mapping.headerRow] || []).map((header, index) => <option key={index} value={index}>{index + 1}. {header || '(ไม่มีหัวคอลัมน์)'}</option>)}</select></Field>)}</div>
      </>}
      <Field label="จัดเข้าห้องเรียน"><select className="form-input" value={mode} onChange={event => setMode(event.target.value)}><option value="new">สร้างห้องเรียนพร้อมรายชื่อ</option><option value="existing">เพิ่มในห้องเรียนที่มีอยู่</option></select></Field>
      {mode === 'existing' ? <Field label="ห้องเรียน"><select required className="form-input" value={classId} onChange={event => setClassId(event.target.value)}><option value="">เลือกห้องเรียน</option>{data.classes.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{classLabel(c)}</option>)}</select></Field> : <><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={fromFile} onChange={event => setFromFile(event.target.checked)} />อ่านชั้นและห้องจากหัวเอกสารโรงเรียน</label><div className="grid grid-cols-2 gap-4">{!fromFile && [['grade','ระดับชั้น'],['room','ห้อง']].map(([key,label]) => <Field key={key} label={label}><input required className="form-input" maxLength={30} value={room[key]} onChange={event => changeRoom(key,event.target.value)} /></Field>)}<Field label="ปีการศึกษา"><input required className="form-input" maxLength={10} value={room.year} onChange={event => changeRoom('year',event.target.value)} /></Field><Field label="ภาคเรียน"><select className="form-input" value={room.term} onChange={event => changeRoom('term',Number(event.target.value))}><option value={1}>1</option><option value={2}>2</option></select></Field></div><Field label="รายวิชาคณิตศาสตร์"><select className="form-input" value={room.subject} onChange={event => changeRoom('subject',event.target.value)}><option value="basic">คณิตศาสตร์พื้นฐาน</option><option value="additional">คณิตศาสตร์เพิ่มเติม</option></select></Field></>}
    </fieldset>
      {rows.length > 0 && !results.length && <><Notice success>พบ {rows.length} คน · {mode === 'new' && fromFile ? `${groups.length} ห้อง · ${groups.map(c => `${c.grade}/${c.room}`).join(', ')}` : '1 ห้อง'} · ภาคเรียน {mode === 'existing' ? data.classes.find(c => c.id === classId)?.term : room.term}/{mode === 'existing' ? data.classes.find(c => c.id === classId)?.year : room.year}</Notice><div className="table-wrap max-h-64"><table className="school-table"><thead><tr><th>รหัสนักเรียน</th><th>ชื่อ–นามสกุล</th><th>บัญชี</th></tr></thead><tbody>{rows.slice(0,10).map(r => <tr key={r.username}><td>{r.username}</td><td>{r.name}</td><td>{data.users.some(u => u.username === r.username) ? 'บัญชีเดิม' : 'บัญชีใหม่'}</td></tr>)}</tbody></table></div><p className="text-xs text-textSecondary">ตัวอย่าง 10 คนแรก ตรวจห้องและภาคเรียนก่อนสร้างบัญชี</p></>}
      {!complete && <Button type="submit" className="w-full" disabled={busy || !rows.length || Boolean(validation)}><Upload size={16} />{busy ? `กำลังนำเข้า ${results.filter(r => r.done).length}/${results.length} คน…` : results.length ? 'นำเข้าต่อเฉพาะรายการที่เหลือ' : 'สร้างบัญชีและจัดเข้าห้องเรียน'}</Button>}
    </form>
    {results.length > 0 && <><Notice success={complete}>{complete ? 'นำเข้าเสร็จแล้ว' : 'ผลการนำเข้าปัจจุบัน'} · สำเร็จ {results.filter(r => r.done).length}/{results.length} คน</Notice><Button disabled={busy || !results.some(r => r.done)} onClick={download}><Download size={16} />ดาวน์โหลดบัญชีและรหัสผ่าน (Excel)</Button><p className="text-xs leading-7 text-textSecondary">ดาวน์โหลดก่อนปิดหน้าต่าง เก็บไฟล์ไว้เฉพาะครูและแจกรหัสเป็นรายบุคคล บัญชีเดิมจะเว้นรหัสผ่านว่าง</p><div className="table-wrap max-h-64"><table className="school-table"><thead><tr><th>รหัสนักเรียน</th><th>ผลการนำเข้า</th></tr></thead><tbody>{results.map(r => <tr key={r.username}><td>{r.username}</td><td>{r.status}</td></tr>)}</tbody></table></div></>}
  </div>;
}
