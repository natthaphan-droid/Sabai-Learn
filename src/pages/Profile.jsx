import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Pencil, UserRound, Mail, Hash, BookOpen, LogOut, ShieldCheck, GraduationCap, Save, X, CircleCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useUser } from '../contexts/UserContext';

export default function Profile() {
  const { profile, setProfile, currentGrade, setCurrentGrade, getGradeLabel } = useUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const photo = useRef(null);
  function save(event) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.nickname.trim()) { setError('กรุณากรอกชื่อและชื่อเล่น'); return; }
    const result = { ...draft, name: draft.name.trim(), nickname: draft.nickname.trim() };
    try { localStorage.setItem('sabai_profile', JSON.stringify(result)); setProfile(result); setEditing(false); setError(''); setMessage('บันทึกโปรไฟล์ในอุปกรณ์นี้แล้ว'); }
    catch { setError('ไม่สามารถบันทึกได้ พื้นที่จัดเก็บในอุปกรณ์อาจเต็ม'); }
  }
  function uploadPhoto(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) { setError('กรุณาใช้ภาพ JPG, PNG หรือ WebP ขนาดไม่เกิน 1 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => { const result = { ...profile, avatar: reader.result }; try { localStorage.setItem('sabai_profile', JSON.stringify(result)); setProfile(result); setDraft(result); setError(''); setMessage('เปลี่ยนรูปโปรไฟล์แล้ว'); } catch { setError('พื้นที่จัดเก็บไม่เพียงพอสำหรับรูปนี้'); } };
    reader.onerror = () => setError('ไม่สามารถอ่านภาพได้ กรุณาเลือกภาพใหม่');
    reader.readAsDataURL(file);
  }
  const fields = [{ key: 'name', label: 'ชื่อ–นามสกุล', icon: UserRound }, { key: 'nickname', label: 'ชื่อเล่น', icon: UserRound }, { key: 'email', label: 'อีเมล', icon: Mail, type: 'email' }, { key: 'studentId', label: 'รหัสนักเรียน', icon: Hash }, { key: 'room', label: 'ห้องเรียน', icon: GraduationCap }, { key: 'track', label: 'สายการเรียน', icon: BookOpen }];

  return <div className="mx-auto max-w-5xl space-y-6"><div><p className="mb-2 text-xs font-medium text-primary">พื้นที่ส่วนตัวของคุณ</p><h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1></div><Card className="relative overflow-hidden p-0"><div className="greeting-banner h-28 border-b border-primary/5" /><div className="flex flex-col items-center gap-5 px-6 pb-7 sm:flex-row sm:items-end md:px-8"><div className="relative -mt-10"><Avatar className="h-28 w-28 text-4xl ring-[5px] ring-white" /><button aria-label="เปลี่ยนรูปโปรไฟล์" onClick={() => photo.current.click()} className="absolute bottom-0 right-0 rounded-full bg-primary p-2.5 text-white ring-[3px] ring-white"><Camera size={17} /></button><input ref={photo} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadPhoto} /></div><div className="flex-1 text-center sm:text-left"><h2 className="text-xl font-bold">{profile.name}</h2><p className="mt-1 text-xs text-textSecondary">({profile.nickname}) · มัธยมศึกษาปีที่ {currentGrade.slice(1)} ห้อง {profile.room}</p><span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-[10px] font-medium text-primary"><ShieldCheck size={13} />บัญชีนักเรียนตัวอย่าง</span></div><Button variant="outline" onClick={() => { setDraft(profile); setEditing(!editing); setMessage(''); setError(''); }}><Pencil size={15} />{editing ? 'ยกเลิกการแก้ไข' : 'แก้ไขโปรไฟล์'}</Button></div></Card>{message && <p role="status" className="flex items-center gap-2 rounded-xl bg-secondary/40 p-4 text-xs text-primary"><CircleCheck size={17} />{message}</p>}{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-xs text-danger">{error}</p>}<div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]"><div className="space-y-6"><Card><h2 className="section-title mb-6 flex items-center gap-3 text-lg font-bold">ข้อมูลส่วนตัว</h2><form onSubmit={save}><div className="grid gap-5 sm:grid-cols-2">{fields.map(field => <div key={field.key}><label htmlFor={`profile-${field.key}`} className="mb-2 flex items-center gap-2 text-xs font-medium text-textSecondary"><field.icon size={14} />{field.label}</label><Input id={`profile-${field.key}`} type={field.type || 'text'} required maxLength={80} value={editing ? draft[field.key] : profile[field.key]} readOnly={!editing} onChange={event => setDraft(previous => ({ ...previous, [field.key]: event.target.value }))} className={editing ? '' : 'border-transparent bg-[#f6f5f1]'} /></div>)}</div>{editing && <div className="mt-6 flex gap-3"><Button type="submit"><Save size={16} />บันทึกข้อมูล</Button><Button variant="ghost" onClick={() => setEditing(false)}><X size={15} />ยกเลิก</Button></div>}</form></Card><Card><h2 className="mb-5 text-base font-bold">รายวิชาที่ลงทะเบียนภาคเรียนนี้</h2><div className="grid gap-3 sm:grid-cols-2">{['คณิตศาสตร์เพิ่มเติม', 'ฟิสิกส์ 2', 'ภาษาไทยเพื่อการสื่อสาร', 'Academic English'].map((title, index) => <Link to={index === 0 ? '/courses' : `/subjects/${['', 'physics', 'thai', 'english'][index]}`} key={title} className="flex items-center gap-3 rounded-xl bg-[#f5f6f0] p-3 text-xs font-medium hover:bg-secondary/40"><BookOpen size={18} className="shrink-0 text-primary" />{title}</Link>)}</div></Card></div><div className="space-y-5"><Card className="bg-[#edf4e9] p-5"><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><GraduationCap size={19} />ระดับชั้นเรียน</h2><p className="mb-4 text-xs leading-relaxed text-textSecondary">เลือกชั้นเรียนเพื่อดูบทเรียน ใบงาน และคะแนนที่ตรงกับระดับของคุณ</p><div className="grid grid-cols-3 gap-2">{['m4', 'm5', 'm6'].map(grade => <button key={grade} aria-pressed={currentGrade === grade} onClick={() => setCurrentGrade(grade)} className={`rounded-xl py-3 text-xs font-semibold ${grade === currentGrade ? 'bg-primary text-white' : 'bg-white text-primary'}`}>ม.{grade.slice(1)}</button>)}</div></Card><Card className="p-5"><p className="text-xs font-semibold text-primary">ข้อมูลการเรียน</p><div className="mt-4 space-y-3 text-xs text-textSecondary"><p className="flex justify-between"><span>ชั้นเรียน</span><span className="font-medium text-textPrimary">{getGradeLabel()}/{profile.room}</span></p><p className="flex justify-between"><span>ภาคเรียน</span><span className="font-medium text-textPrimary">1/2569</span></p><p className="flex justify-between"><span>สถานะ</span><span className="font-medium text-primary">กำลังศึกษา</span></p></div></Card><Link to="/login" className="flex items-center justify-center gap-2 rounded-xl border border-[#efd9d2] bg-[#fff5f1] py-3 text-xs font-medium text-[#af6c59]"><LogOut size={17} />กลับไปหน้าเข้าสู่ระบบ</Link><p className="px-2 text-[10px] leading-relaxed text-textSecondary">โปรไฟล์นี้เก็บไว้ในอุปกรณ์ของคุณ และใช้สำหรับทดลองเว็บไซต์</p></div></div></div>;
}
