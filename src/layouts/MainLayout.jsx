import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, FileText, ChartNoAxesColumnIncreasing, UserRound, Menu, X, LogOut, UsersRound, Settings, Flag, RefreshCw, Sprout } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Contact, Notice, Empty } from '../components/ClassroomUI';
import { Button } from '../components/ui/Button';
const studentNav = [['/dashboard','หน้าหลัก',Home],['/courses','ห้องเรียน',BookOpen],['/assignments','งานของฉัน',ClipboardList],['/scores','คะแนน',ChartNoAxesColumnIncreasing],['/worksheets','ใบงาน / เอกสาร',FileText],['/profile','บัญชีของฉัน',UserRound]];
const teacherNav = [['/admin/dashboard','ภาพรวม',Home],['/admin/classes','ห้องเรียน',BookOpen],['/admin/students','นักเรียน',UsersRound],['/admin/lessons','คาบเรียน',FileText],['/admin/work','งานที่ได้รับ',ClipboardList],['/admin/scores','คะแนน',ChartNoAxesColumnIncreasing],['/admin/followups','ติดตามนักเรียน',Flag],['/admin/settings','ตั้งค่า',Settings],['/profile','บัญชีของฉัน',UserRound]];
export default function MainLayout() {
  const { user, data, error, refreshing, reload, logout } = useUser();
  const location = useLocation(), [open, setOpen] = useState(false);
  const nav = user.role === 'admin' ? teacherNav : studentNav;
  const title = nav.find(([path]) => location.pathname === path)?.[1] || 'ห้องเรียนคณิตศาสตร์';
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); document.title = `${title} · Sabai Learn`; }, [location.pathname, title]);
  useEffect(() => { const escape = event => { if (event.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  const navigation = nav.map(([to,label,Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm ${isActive ? 'bg-secondary font-semibold text-primary' : 'text-textSecondary hover:bg-background'}`}><Icon size={19} /><span>{label}</span></NavLink>);
  return <div className="min-h-screen bg-background">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-3">ข้ามไปยังเนื้อหา</a>
    {open && <button aria-label="ปิดเมนู" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/30 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-primary/10 bg-[#fffefa] p-4 transition-transform lg:visible lg:translate-x-0 ${open ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}>
      <Link to="/" className="mb-6 mt-3 flex items-center gap-3 px-3"><img src="/brand-mark.svg" alt="" className="h-10 w-10" /><span><span className="block text-lg font-bold text-primary">สบายเรียน</span><span className="text-[10px] text-textSecondary">ห้องเรียนคณิตศาสตร์</span></span></Link>
      <nav aria-label="เมนูหลัก" className="flex-1 space-y-1 overflow-y-auto">{navigation}</nav>
      <div className="sidebar-note my-4 rounded-2xl bg-background p-4"><Sprout size={22} className="mb-2 text-primary" /><p className="text-xs leading-6 text-textSecondary">ค่อย ๆ เรียน ค่อย ๆ เติบโต<br />ทุกคาบย้อนกลับมาเรียนได้</p></div>
      <Contact contact={data?.contact} />
      <button onClick={() => logout().catch(() => {})} className="mt-3 flex min-h-11 items-center justify-center gap-2 text-xs text-textSecondary"><LogOut size={15} />ออกจากระบบ</button>
    </aside>
    <div className="lg:ml-[248px]"><header className="sticky top-0 z-20 flex min-h-[76px] items-center gap-3 border-b border-primary/10 bg-background/95 px-4 backdrop-blur md:px-8">
      <Button variant="ghost" className="lg:hidden" aria-label={open ? 'ปิดเมนูหลัก' : 'เปิดเมนูหลัก'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</Button>
      <div className="min-w-0"><p className="text-[10px] text-textSecondary">{user.role === 'admin' ? 'พื้นที่ของคุณครู' : 'ห้องเรียนของฉัน'}</p><p className="truncate text-sm font-semibold">{title}</p></div>
      <Button variant="ghost" className="ml-auto" onClick={reload} disabled={refreshing} aria-label="รีเฟรชข้อมูล"><RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} /></Button>
      <Link to="/profile" className="flex min-w-0 items-center gap-3"><span className="hidden max-w-48 truncate text-xs font-semibold md:block">{user.name}</span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ded5ee] text-primary">{user.name.slice(0,1)}</span></Link>
    </header><main id="main-content" className="page-content mx-auto max-w-[1400px] px-4 py-6 pb-28 md:px-8 lg:pb-10">
      {document.documentElement.dataset.sabaiTest && <p className="mb-5 rounded-xl bg-[#f4e9c7] px-4 py-3 text-xs leading-6 text-[#745b25]">ทดสอบในเครื่อง · บัญชี งาน ไฟล์ และคะแนนในหน้านี้เป็นข้อมูลทดสอบ ไม่ใช่ข้อมูลนักเรียนจริง</p>}
      <Notice>{error}</Notice>{data ? <Outlet /> : error ? <Empty title="เปิดข้อมูลไม่ได้"><Button onClick={reload} className="mx-auto mt-4">ลองใหม่</Button></Empty> : <p role="status" className="py-20 text-center text-textSecondary">กำลังเปิดข้อมูลห้องเรียน…</p>}
      <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-5 text-[10px] text-textSecondary"><span>Sabai Learn · เรียนคณิตศาสตร์อย่างสบายใจ</span><Link to="/privacy">การใช้ข้อมูล</Link></footer>
    </main></div>
    <nav aria-label="เมนูมือถือ" className="fixed inset-x-0 bottom-0 z-20 flex border-t border-primary/10 bg-[#fffefa]/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">{nav.slice(0,4).map(([to,label,Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] ${isActive ? 'bg-secondary/50 font-semibold text-primary' : 'text-textSecondary'}`}><Icon size={19} />{label}</NavLink>)}<button onClick={() => setOpen(!open)} className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] text-textSecondary"><Menu size={19} />เพิ่มเติม</button></nav>
  </div>;
}
