import { useEffect, useRef } from 'react';
import { Download, ExternalLink, BookOpen, X, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';
export { summarizeScores, statusOf, validateFile } from '../../backend-worker/src/domain.js';
export const categories = { coursework: 'คะแนนเก็บ', midterm: 'กลางภาค', final: 'ปลายภาค' };
export const classLabel = c => `${c.grade}/${c.room} · ${c.title} · ${c.term}/${c.year}`;
export const formatDate = value => value ? new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium' }).format(new Date(value)) : 'ไม่กำหนด';
export const formatDateTime = value => value ? new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Bangkok' }).format(new Date());
export const dueLocal = value => value ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value)).replace(' ', 'T') : '';
export const dueISO = value => value ? new Date(`${value}:00+07:00`).toISOString() : null;
export function PageTitle({ eyebrow, title, description, children }) {
  return <div className="greeting-banner mb-7 flex flex-wrap items-center justify-between gap-4 rounded-[26px] p-6 md:p-8"><div>{eyebrow && <p className="mb-2 text-xs font-semibold text-primary">{eyebrow}</p>}<h1 className="text-3xl text-primary">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-7 text-textSecondary">{description}</p>}</div>{children}</div>;
}
export function Empty({ title = 'ยังไม่มีรายการ', children }) { return <div className="rounded-3xl border border-dashed border-primary/20 bg-white/40 px-6 py-12 text-center"><BookOpen className="mx-auto mb-4 text-primary/50" size={30} /><h2 className="font-semibold">{title}</h2><div className="mt-2 text-sm leading-7 text-textSecondary">{children}</div></div>; }
export function Field({ label, children, hint, ...props }) { return <label className="grid min-w-0 gap-2 text-sm font-semibold" {...props}><span>{label}</span>{children}{hint && <span className="text-xs font-normal leading-6 text-textSecondary">{hint}</span>}</label>; }
export function Notice({ children, success = false }) { return children ? <p role={success ? 'status' : 'alert'} className={`my-4 rounded-xl p-4 text-sm leading-7 ${success ? 'bg-secondary/60 text-primary' : 'bg-red-50 text-red-800'}`}>{children}</p> : null; }
const statusNames = { pending: 'ยังไม่ส่ง', overdue: 'เลยกำหนด · ยังไม่ส่ง', submitted: 'ส่งแล้วรอตรวจ', graded: 'ตรวจแล้ว', revision: 'รอส่งแก้ไข' };
export function Status({ status, late }) { return <span className="flex flex-wrap gap-1.5"><span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${['overdue','revision'].includes(status) ? 'bg-[#f6ded3] text-[#923e24]' : status === 'graded' ? 'bg-[#dfeccf] text-[#385829]' : status === 'submitted' ? 'bg-[#e4e4fa] text-[#525288]' : 'bg-[#f5eed8] text-[#7c6530]'}`}>{statusNames[status]}</span>{late && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] text-orange-800">ส่งช้า</span>}</span>; }
export function FileLinks({ files = [] }) { return <div className="grid gap-2">{files.map(file => <div key={file.id} className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-primary/10 bg-white p-3"><span className="min-w-0 flex-1 break-words text-sm">{file.name}<span className="ml-2 text-[10px] text-textSecondary">{(file.size / 1024).toFixed(0)} KB</span></span><a className="inline-flex min-h-10 items-center gap-1 px-2 text-xs text-primary" href={`/api/files/${file.id}`} target="_blank" rel="noreferrer"><ExternalLink size={14} />เปิด</a><a className="inline-flex min-h-10 items-center gap-1 px-2 text-xs text-primary" href={`/api/files/${file.id}?download=1`}><Download size={14} />ดาวน์โหลด</a></div>)}</div>; }
export function Contact({ contact }) { return contact?.lineUrl ? <a href={contact.lineUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#d8eac7] px-4 text-sm font-semibold text-primary"><MessageCircle size={18} />ติดต่อ{contact.teacherName || 'ครู'}ทาง LINE</a> : <p className="text-xs text-textSecondary">ครูยังไม่ได้ระบุช่องทางติดต่อ</p>; }
export function Modal({ title, children, onClose, busy = false }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (!busy && event.target === ref.current) onClose(); }}><div className="p-5 md:p-7"><div className="mb-5 flex items-start justify-between gap-3"><h2 id="modal-title" className="text-xl font-bold">{title}</h2><Button variant="ghost" aria-label="ปิดหน้าต่าง" disabled={busy} onClick={onClose}><X size={18} /></Button></div>{children}</div></dialog>;
}
