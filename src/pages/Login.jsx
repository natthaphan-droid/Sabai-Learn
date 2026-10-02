import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import LearningBuddy from '../components/LearningBuddy';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/Button';
import { Field, Notice } from '../components/ClassroomUI';
import { api } from '../lib/api';
export default function Login() {
  const { user, login } = useUser(), navigate = useNavigate(), location = useLocation();
  const [show, setShow] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [availability, setAvailability] = useState('');
  useEffect(() => { document.title = 'เข้าสู่ห้องเรียน · Sabai Learn'; }, []);
  useEffect(() => {
    let active = true;
    api('/health').then(health => {
      if (active && (!health.authenticationConfigured || health.setupRequired)) setAvailability('ห้องเรียนกำลังเตรียมบัญชีผู้ใช้ กรุณารอครูแจ้งรหัสเข้าใช้ก่อนเริ่มเรียน');
    }).catch(failure => { if (active) setAvailability(failure.message); });
    return () => { active = false; };
  }, []);
  if (user) return <Navigate to={user.mustChange ? '/password' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const values = new FormData(event.currentTarget);
    try { const result = await login(values.get('username'), values.get('password')); navigate(result.mustChange ? '/password' : result.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true }); }
    catch (failure) { setError(failure.message); } finally { setBusy(false); }
  }
  return <main className="grid min-h-dvh lg:grid-cols-2"><section className="login-panel hidden flex-col items-center justify-center p-12 lg:flex"><LearningBuddy className="w-full max-w-[400px]" /><h1 className="mt-4 text-center text-4xl">กลับมาเรียนกันต่อ</h1><p className="mt-4 text-sm leading-8 text-textSecondary">บทเรียนของทุกคาบ รอให้กลับมาทบทวนเสมอ</p></section><section className="flex items-center justify-center px-5 py-10"><div className="w-full max-w-md"><Link to="/" className="mb-10 flex items-center gap-3"><img src="/brand-mark.svg" alt="" className="h-11 w-11" /><span className="brand-wordmark text-2xl">Sabai Learn.</span></Link><h1 className="display-heading text-3xl">เข้าสู่ห้องเรียน</h1><p className="mt-4 text-sm leading-7 text-textSecondary">นักเรียนใช้รหัสนักเรียน ครูใช้ชื่อบัญชีผู้ดูแล</p><Notice success>{document.documentElement.dataset.sabaiTest === 'true' && 'ทดสอบในเครื่อง · บัญชี งาน ไฟล์ และคะแนนเป็นข้อมูลทดสอบ'}</Notice><Notice success>{location.state?.message}</Notice><Notice success>{availability}</Notice><Notice>{error}</Notice><form onSubmit={submit} className="mt-7 space-y-5"><Field label="รหัสนักเรียน / ชื่อเข้าใช้"><input name="username" autoComplete="username" required maxLength={40} className="form-input" /></Field><Field label="รหัสผ่าน"><span className="relative"><input name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required maxLength={128} className="form-input pr-14" /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} className="absolute right-2 top-1 rounded-lg p-3 text-textSecondary">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></Field><Button type="submit" disabled={busy || Boolean(availability)} className="w-full">{busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}<ArrowRight size={17} /></Button></form><p className="mt-6 text-xs leading-7 text-textSecondary">ลืมรหัสผ่านหรือยังไม่มีบัญชี? ติดต่อครูประจำวิชาเพื่อขอรหัสเข้าใช้</p><Link to="/privacy" className="mt-8 inline-block text-xs text-primary underline underline-offset-4">การใช้ข้อมูลในห้องเรียน</Link></div></section></main>;
}
