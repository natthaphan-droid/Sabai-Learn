import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText, X, CircleCheck, CalendarDays, UserRound, Save, Send, BadgeCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { allAssignments, formatDate } from '../data/platform';
import { mathCurriculum } from '../data/curriculum';

export default function AssignmentDetail() {
  const { id } = useParams();
  const fileInput = useRef(null);
  const confirmation = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState(() => { try { return JSON.parse(localStorage.getItem(`sabai_draft_${id}`) || '{}').note || ''; } catch { return ''; } });
  const [receipt, setReceipt] = useState(() => { try { return JSON.parse(localStorage.getItem(`sabai_receipt_${id}`) || 'null'); } catch { return null; } });
  const topic = Object.values(mathCurriculum).flatMap(grade => Object.values(grade).flat()).flatMap(chapter => chapter.topics.map(item => ({ ...item, chapter }))).find(item => `ws-${item.chapter.id}-${item.id}` === id);
  const assignment = allAssignments.find(item => item.id === id) || (topic && { title: `แบบฝึกหัดทบทวน: ${topic.name}`, course: topic.chapter.title, description: `ทบทวนเนื้อหาเรื่อง ${topic.name} เขียนสรุปแนวคิดสำคัญ พร้อมยกตัวอย่างโจทย์และวิธีทำ 3 ข้อ สามารถแนบไฟล์ PDF หรือภาพถ่ายคำตอบได้`, maxScore: 20, status: 'pending' });
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (!assignment) return <div className="py-20 text-center"><h1 className="text-lg font-bold">ไม่พบงานที่ต้องการ</h1><Link to="/assignments" className="mt-4 inline-block text-sm text-primary underline">กลับไปหน้างานที่ได้รับ</Link></div>;
  const isComplete = assignment.status === 'completed';

  function addFiles(list) {
    const incoming = Array.from(list);
    const invalid = incoming.find(file => !/\.(pdf|docx?|jpe?g|png|webp)$/i.test(file.name) || file.size > 10 * 1024 * 1024 || file.size === 0);
    if (invalid) { setError(`ไฟล์ ${invalid.name} ไม่รองรับหรือมีขนาดเกิน 10 MB กรุณาใช้ PDF, Word หรือภาพ JPG/PNG/WebP`); return; }
    setError(''); setMessage('');
    setFiles(previous => [...previous, ...incoming.filter(file => !previous.some(old => old.name === file.name && old.size === file.size))]);
    if (fileInput.current) fileInput.current.value = '';
  }
  function saveDraft() {
    try {
      localStorage.setItem(`sabai_draft_${id}`, JSON.stringify({ note, savedAt: new Date().toISOString() }));
      setMessage('บันทึกข้อความฉบับร่างในอุปกรณ์นี้แล้ว ไฟล์แนบจะต้องเลือกใหม่หากปิดหรือรีเฟรชหน้า');
      setError('');
    } catch { setError('ไม่สามารถบันทึกฉบับร่างได้ พื้นที่จัดเก็บในอุปกรณ์อาจเต็ม'); }
  }
  async function submit() {
    if (!apiUrl || !files.length || uploading) return;
    confirmation.current.close(); setUploading(true); setError('');
    try {
      await Promise.all(files.map(async file => {
        const body = new FormData(); body.append('file', file); body.append('assignmentId', id); body.append('note', note);
        const response = await fetch(`${apiUrl}/api/upload`, { method: 'POST', body });
        if (!response.ok) throw new Error('อัปโหลดไม่สำเร็จ กรุณาลองอีกครั้ง');
      }));
      const result = { at: new Date().toISOString(), files: files.map(file => file.name) };
      localStorage.setItem(`sabai_receipt_${id}`, JSON.stringify(result));
      setReceipt(result); setFiles([]);
    } catch { setError('อัปโหลดไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือติดต่อคุณครู ไฟล์ของคุณยังอยู่ในหน้านี้'); }
    finally { setUploading(false); }
  }

  return <div className="space-y-6"><Link to="/assignments" className="flex items-center gap-2 text-xs text-textSecondary hover:text-primary"><ArrowLeft size={16} />กลับไปหน้างานที่ได้รับ</Link><section className="greeting-banner rounded-2xl p-6 md:p-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><p className="mb-2 flex items-center gap-2 text-xs text-primary"><UserRound size={14} />{assignment.course} · ครูสมศรี มีสุข</p><h1 className="text-2xl font-bold leading-relaxed">{assignment.title}</h1><div className="mt-4 flex items-center gap-3"><Badge variant={isComplete || receipt ? 'success' : 'warning'}>{isComplete ? 'ตรวจแล้ว' : receipt ? 'อัปโหลดแล้ว' : 'รอส่ง'}</Badge><span className="text-xs text-textSecondary">คะแนนเต็ม {assignment.maxScore} คะแนน</span></div></div><div className="shrink-0 rounded-xl bg-white/80 px-4 py-3"><p className="mb-1 text-[10px] text-textSecondary">กำหนดส่ง</p><p className="flex items-center gap-2 text-xs font-semibold text-primary"><CalendarDays size={15} />{assignment.deadline ? `${formatDate(assignment.deadline)} · 23:59 น.` : 'ไม่มีกำหนดส่ง'}</p></div></div></section><div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"><Card className="p-6 md:p-8"><h2 className="section-title flex items-center gap-2.5 text-lg font-bold">คำชี้แจงและรายละเอียดโจทย์</h2><p className="mt-5 text-sm leading-8 text-textSecondary">{assignment.description}</p><div className="mt-7 rounded-xl bg-[#f4f6ef] p-5"><h3 className="flex items-center gap-2 text-sm font-semibold text-primary"><BadgeCheck size={18} />ก่อนส่งงาน อย่าลืมตรวจสอบ</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-textSecondary"><li>เขียนชื่อ ชั้น และเลขที่ให้ชัดเจน</li><li>แสดงวิธีทำและตรวจทานคำตอบให้ครบทุกข้อ</li><li>ถ่ายภาพให้อ่านได้ชัดเจน หรือรวมเป็นไฟล์ PDF</li></ul></div>{isComplete && <div className="mt-6 rounded-xl bg-secondary/40 p-5"><p className="text-sm font-semibold text-primary">ผลการประเมิน: {assignment.score}/{assignment.maxScore} คะแนน</p><p className="mt-2 text-xs text-textSecondary">ข้อมูลคะแนนตัวอย่างสำหรับทดลองใช้งาน</p></div>}</Card><Card className="p-6"><h2 className="mb-5 text-lg font-bold">{isComplete ? 'สถานะงานของคุณ' : 'พื้นที่ส่งงานของคุณ'}</h2>{isComplete || receipt ? <div className="py-6 text-center"><CircleCheck size={48} className="mx-auto mb-4 text-success" /><h3 className="text-base font-bold">{isComplete ? 'งานนี้ตรวจเรียบร้อยแล้ว' : 'อัปโหลดไฟล์เรียบร้อยแล้ว'}</h3>{receipt && <><p className="mt-2 text-xs text-textSecondary">{formatDate(receipt.at)}</p><ul className="mt-4 space-y-1 text-xs text-textSecondary">{receipt.files.map(name => <li key={name} className="break-all">{name}</li>)}</ul></>}</div> : <><label htmlFor="assignment-note" className="mb-2 block text-xs font-medium text-textSecondary">ข้อความถึงคุณครู</label><textarea id="assignment-note" placeholder="เพิ่มคำอธิบายหรือข้อสงสัยเกี่ยวกับงาน..." value={note} onChange={event => setNote(event.target.value)} className="mb-4 min-h-24 w-full resize-y rounded-xl border border-gray-200 p-3 text-xs leading-relaxed outline-none focus:border-success" /><div onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }} className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragging ? 'border-success bg-secondary/40' : 'border-[#dce3d6] bg-[#fafbf7]'}`}><UploadCloud className="mx-auto mb-3 text-success" size={38} /><p className="text-sm font-semibold">ลากไฟล์มาวางที่นี่</p><p className="mt-2 text-[10px] leading-relaxed text-textSecondary">PDF, Word, JPG, PNG, WebP · สูงสุด 10 MB ต่อไฟล์</p><input ref={fileInput} aria-label="แนบไฟล์งาน" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" className="hidden" onChange={event => addFiles(event.target.files)} /><Button variant="secondary" className="mx-auto mt-4" onClick={() => fileInput.current.click()}>เลือกไฟล์</Button></div><div className="mt-3 space-y-2">{files.map((file, index) => <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-lg bg-[#f5f5f0] p-3"><FileText size={16} className="shrink-0 text-primary" /><span className="min-w-0 flex-1 truncate text-xs">{file.name}</span><span className="text-[9px] text-textSecondary">{(file.size / 1024).toFixed(0)} KB</span><button aria-label={`ลบไฟล์ ${file.name}`} onClick={() => setFiles(previous => previous.filter((_, i) => i !== index))}><X size={16} className="text-textSecondary" /></button></div>)}</div>{error && <p role="alert" className="mt-4 text-xs leading-relaxed text-danger">{error}</p>}{message && <p role="status" className="mt-4 rounded-xl bg-secondary/40 p-3 text-xs leading-relaxed text-primary">{message}</p>}<Button variant="outline" className="mt-5 w-full" onClick={saveDraft}><Save size={16} />บันทึกฉบับร่าง</Button><Button className="mt-3 w-full" disabled={!apiUrl || !files.length || uploading} onClick={() => confirmation.current.showModal()}><Send size={16} />{uploading ? 'กำลังอัปโหลด...' : 'ส่งงาน'}</Button>{!apiUrl && <p className="mt-3 text-[10px] leading-relaxed text-textSecondary">ระบบตัวอย่าง: บันทึกข้อความฉบับร่างได้ การส่งไฟล์ถึงคุณครูจะพร้อมเมื่อเชื่อมต่อระบบโรงเรียน</p>}</>}</Card></div><dialog ref={confirmation} aria-labelledby="confirm-title" className="max-w-sm"><div className="p-7"><h2 id="confirm-title" className="text-xl font-bold">ยืนยันการส่งงาน</h2><p className="mt-3 text-sm text-textSecondary">คุณกำลังส่งไฟล์ {files.length} ไฟล์ ตรวจสอบให้ครบก่อนส่ง</p><div className="mt-6 flex gap-3"><Button variant="ghost" className="flex-1 bg-gray-100" onClick={() => confirmation.current.close()}>กลับไปตรวจ</Button><Button className="flex-1" onClick={submit}>ยืนยันส่งงาน</Button></div></div></dialog></div>;
}
