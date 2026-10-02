import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ClipboardCheck, ChartNoAxesColumnIncreasing, ChevronDown, Sparkles, Check, Pin, KeyRound, MessageCircle } from 'lucide-react';
import LearningBuddy from '../components/LearningBuddy';

const topics = [['news','ข่าวสาร'],['features','การใช้งาน'],['faq','คำถามที่พบบ่อย']];
const features = [
  { icon:BookOpen, color:'#e2eacb', title:'ขาดคาบไหน ก็กลับมาเรียนได้', text:'เลือกวันที่เรียน เปิดเนื้อหาและวิดีโอ แล้วดาวน์โหลดใบงานของคาบนั้น ทุกอย่างอยู่ในห้องเรียนเดียวกัน', tags:['บทเรียนรายคาบ','วิดีโอประกอบ','ใบงานดาวน์โหลด'] },
  { icon:ClipboardCheck, color:'#e5dcf0', title:'รู้ว่างานไหน ส่งแล้วหรือยัง', text:'แนบรูปใบงานหรือไฟล์ผ่านเว็บได้ ครูบันทึกงานที่รับเป็นกระดาษให้ได้ด้วย พร้อมดูสถานะและข้อเสนอแนะหลังตรวจ', tags:['ส่งไฟล์และรูป','งานกระดาษ','ติดตามงานค้าง'] },
  { icon:ChartNoAxesColumnIncreasing, color:'#d9e5f7', title:'เห็นคะแนน เพื่อก้าวต่อไป', text:'ดูคะแนนเก็บ กลางภาค และปลายภาคของตัวเอง ครูติดตามนักเรียนที่ต้องการความช่วยเหลือและติดต่อกันผ่าน LINE ได้', tags:['คะแนนเก็บ 60','กลางภาค 20','ปลายภาค 20'] },
];
const questions = [
  { q:'ขาดเรียนแล้วเริ่มเรียนตรงไหน?', a:'เข้าสู่ระบบ เลือกห้องเรียน แล้วเลือกวันที่หรือหัวข้อของคาบที่ขาด เปิดสื่อประกอบและดาวน์โหลดใบงานของคาบนั้นได้' },
  { q:'สมัครเองได้ไหม?', a:'ครูเป็นผู้สร้างบัญชีและจัดนักเรียนเข้าห้องเรียน ขอรหัสเข้าใช้จากครู และเปลี่ยนรหัสผ่านเมื่อเข้าใช้ครั้งแรก' },
  { q:'ส่งงานเป็นกระดาษได้ไหม?', a:'ได้ ครูจะบันทึกการรับงานกระดาษ สถานะงานและคะแนนจะแสดงในบัญชีของนักเรียนเช่นเดียวกับงานที่ส่งออนไลน์' },
  { q:'ลืมรหัสผ่านต้องทำอย่างไร?', a:'ติดต่อครูเพื่อรีเซ็ตรหัสผ่าน จากนั้นเข้าสู่ระบบและตั้งรหัสผ่านใหม่ของตัวเอง' },
];

export default function Home() {
  const [topic,setTopic] = useState('news');
  return <div className="home-page">
    <a href="#home-board" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-3">ข้ามไปยังกระดานข่าวสาร</a>
    <header className="home-header">
      <Link to="/" className="home-brand"><img src="/brand-mark.svg" alt="" /><span className="brand-wordmark">Sabai Learn<span className="text-[#8aa474]">.</span></span></Link>
      <Link to="/login" className="home-login">เข้าสู่ห้องเรียน <ArrowRight size={16} /></Link>
    </header>
    <main className="home-main">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="home-eyebrow"><Sparkles size={15} />ห้องเรียนคณิตศาสตร์ออนไลน์</p>
        <h1 id="home-title" className="display-heading">ตามเรียนได้ทุกคาบ<br /><span className="text-[#648452]">สบายใจทุกก้าว</span></h1>
        <p className="home-description">บทเรียน ใบงาน งานส่ง และคะแนนในที่เดียว<br />ขาดเรียนหรือลา ก็กลับมาทบทวนได้เสมอ</p>
        <LearningBuddy className="home-buddy buddy-float" />
        <Link to="/login" className="home-enter action-blue">เข้าห้องเรียนของฉัน <ArrowRight size={18} /></Link>
        <p className="home-account-note"><Check size={14} />ใช้รหัสนักเรียนและรหัสผ่านที่ครูให้</p>
      </section>
      <section className="home-board" aria-labelledby="home-board-title">
        <div className="home-board-heading"><span className="home-pin"><Pin size={21} /></span><div><h2 id="home-board-title">กระดานข่าวสาร</h2><p>ข้อมูลและคำแนะนำก่อนเข้าเรียน</p></div><span className="home-board-label">สบายเรียน</span></div>
        <nav className="home-board-topics" aria-label="หัวข้อกระดานข่าวสาร">{topics.map(([key,label]) => <button key={key} type="button" aria-pressed={topic === key} aria-controls="home-board" onClick={() => setTopic(key)}>{label}</button>)}</nav>
        <div key={topic} id="home-board" className="home-board-scroll" role="region" aria-label={`กระดานข่าวสาร · ${topics.find(([key]) => key === topic)[1]}`} tabIndex={0}>
          {topic === 'news' && <>
            <article className="home-paper home-paper-pinned"><p className="home-paper-tag"><Pin size={14} />ปักหมุด · ก่อนเข้าเรียนครั้งแรก</p><h3>เริ่มต้นด้วยบัญชีที่ครูให้</h3><p>นักเรียนใช้รหัสนักเรียนเป็นชื่อเข้าใช้ ครูจะจัดห้องเรียนไว้ให้ เมื่อเข้าใช้ครั้งแรก ให้เปลี่ยนรหัสผ่านเริ่มต้นเป็นรหัสของตัวเองอย่างน้อย 8 ตัวอักษร</p><p className="home-paper-note"><KeyRound size={16} />ลืมรหัสผ่าน? ติดต่อครูเพื่อรีเซ็ตรหัสได้</p></article>
            <article className="home-paper"><p className="home-paper-tag"><BookOpen size={14} />เรียนรู้ในจังหวะของตัวเอง</p><h3>คาบที่ขาด ยังกลับมาเรียนได้</h3><p>เลือกห้องและวันที่เรียน เพื่อเปิดเนื้อหา ดูวิดีโอ และดาวน์โหลดใบงาน ติดตามงานที่ส่งแล้วหรืองานที่รอส่ง พร้อมดูคะแนนของตัวเองได้ในห้องเรียน</p></article>
            <article className="home-paper home-paper-green"><h3>ไม่ต้องตามเรียนคนเดียว</h3><p>ติดต่อครูผ่าน LINE และดูเวลาติดต่อได้จากห้องเรียน หากยังไม่มีบัญชี ให้ขอรหัสเข้าใช้จากครูประจำวิชา</p><p className="home-paper-note"><MessageCircle size={16} />ค่อย ๆ เรียน ค่อย ๆ เติบโต</p></article>
            <div className="home-board-assurances">{['เปิดได้ทั้งคอม มือถือ และแท็บเล็ต','ข้อมูลของแต่ละคนแยกเป็นส่วนตัว','ครูและนักเรียนมีพื้นที่ของตัวเอง'].map(text => <p key={text}><Check size={15} />{text}</p>)}</div>
          </>}
          {topic === 'features' && features.map(feature => <article key={feature.title} className="home-paper"><span className="home-feature-icon" style={{ background:feature.color }}><feature.icon size={24} /></span><h3>{feature.title}</h3><p>{feature.text}</p><div className="home-feature-tags">{feature.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}
          {topic === 'faq' && <><p className="home-faq-intro">เลือกคำถามเพื่อเปิดอ่านคำตอบ</p>{questions.map(item => <details key={item.q} className="home-paper group"><summary>{item.q}<ChevronDown size={18} className="shrink-0 group-open:rotate-180" /></summary><p>{item.a}</p></details>)}</>}
        </div>
        <p className="home-board-hint">เลื่อนอ่านเพิ่มเติมภายในกระดานนี้</p>
      </section>
    </main>
    <footer className="home-footer"><span>Sabai Learn · เรียนคณิตศาสตร์อย่างสบายใจ</span><Link to="/privacy">การใช้ข้อมูล</Link></footer>
  </div>;
}
