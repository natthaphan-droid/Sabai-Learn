import { mathCurriculum } from './curriculum.js';

export const subjectCourses = [
  { id: 'physics', title: 'ฟิสิกส์ 2 (แรงและการเคลื่อนที่)', tag: 'วิทยาศาสตร์กายภาพ', teacher: 'ดร.ปรีชา เก่งกล้า', progress: 67, completed: 8, lessons: 12, score: '9.5/10', description: 'เข้าใจการเคลื่อนที่ แรง และพลังงาน ผ่านแนวคิดพื้นฐานและตัวอย่างในชีวิตประจำวัน', units: [
    { title: 'การเคลื่อนที่แนวตรง', text: 'ความเร็วเฉลี่ย คือ การกระจัดหารด้วยช่วงเวลา ส่วนอัตราเร็วเฉลี่ย คือ ระยะทางทั้งหมดหารด้วยช่วงเวลา\nสำหรับความเร่งคงตัว ใช้ v = u + at และ s = ut + ½at² โดยต้องกำหนดทิศทางบวกและใช้หน่วยให้สอดคล้องกัน' },
    { title: 'กฎการเคลื่อนที่ของนิวตัน', text: 'กฎข้อที่ 1: วัตถุคงสภาพหยุดนิ่งหรือเคลื่อนที่ด้วยความเร็วคงตัว เมื่อแรงลัพธ์เป็นศูนย์\nกฎข้อที่ 2: แรงลัพธ์เท่ากับมวลคูณความเร่ง (ΣF = ma)\nกฎข้อที่ 3: แรงกิริยาและปฏิกิริยามีขนาดเท่ากัน ทิศทางตรงข้าม และกระทำต่อวัตถุคนละชิ้น' },
    { title: 'งานและพลังงาน', text: 'งานของแรงคงตัวคำนวณจาก W = Fs cos θ พลังงานจลน์คือ ½mv² และพลังงานศักย์โน้มถ่วงใกล้ผิวโลกคือ mgh\nเมื่อมีเฉพาะแรงอนุรักษ์ พลังงานกลรวมจะคงตัว' },
  ] },
  { id: 'thai', title: 'ภาษาไทยเพื่อการสื่อสาร', tag: 'ภาษาไทย', teacher: 'อ.พิมพพร สดใส', progress: 100, completed: 10, lessons: 10, score: '20/20', description: 'ฝึกอ่านอย่างเข้าใจ เขียนอย่างชัดเจน และสื่อสารอย่างสร้างสรรค์', units: [
    { title: 'การอ่านจับใจความ', text: 'เริ่มจากอ่านเพื่อดูภาพรวม แล้วหาใจความสำคัญของแต่ละย่อหน้า แยกข้อเท็จจริงออกจากความคิดเห็น และสรุปด้วยคำของตนเอง\nฝึกตอบคำถามว่า ใคร ทำอะไร ที่ไหน เมื่อใด เพราะอะไร และอย่างไร เพื่อรวบรวมสาระสำคัญให้ครบถ้วน' },
    { title: 'การเขียนย่อความ', text: 'อ่านเรื่องต้นฉบับให้เข้าใจ เลือกเฉพาะใจความสำคัญ เรียบเรียงใหม่ด้วยภาษาของตนเอง และรักษาความหมายเดิม\nหลีกเลี่ยงการคัดลอกทั้งประโยค และตรวจสอบว่าสรุปครอบคลุมประเด็นหลักโดยไม่เติมความคิดเห็นส่วนตัว' },
    { title: 'การพูดนำเสนอ', text: 'กำหนดวัตถุประสงค์และผู้ฟัง จัดเนื้อหาเป็นบทนำ เนื้อเรื่อง และบทสรุป ยกตัวอย่างที่เข้าใจง่าย พร้อมซ้อมให้พอดีกับเวลา\nใช้ภาษาสุภาพ สบตาผู้ฟัง และเปิดโอกาสให้ซักถาม' },
  ] },
  { id: 'english', title: 'Academic English', tag: 'ภาษาต่างประเทศ', teacher: 'Teacher Michael Scott', progress: 73, completed: 11, lessons: 15, score: '17/20', description: 'Build confidence in reading, vocabulary, and clear academic writing.', units: [
    { title: 'Reading for the main idea', text: 'Skim the title and topic sentences first. Identify the central argument, then find supporting details. Summarize the main idea in one sentence using your own words.' },
    { title: 'Academic vocabulary', text: 'Analyze: examine something in detail. Evidence: information that supports a claim. Contrast: show differences. Summarize: give the main points briefly.\nPractice by using each word in a sentence related to a subject you are studying.' },
    { title: 'Writing a clear paragraph', text: 'Start with a topic sentence. Add an explanation and an example. Finish with a sentence that connects the evidence to your main point.\nExample: Regular practice improves learning. Short daily sessions help learners remember new ideas. Therefore, a consistent study routine is useful.' },
  ] },
];

export function getDashboardCourses(grade) {
  const chapter = mathCurriculum[grade].additional[0];
  return [
    { id: chapter.id, title: 'คณิตศาสตร์เพิ่มเติม', tag: `มัธยมศึกษาปีที่ ${grade.slice(1)}`, teacher: 'ครูสมศรี มีสุข', progress: 78, completed: 14, lessons: 18, score: '18/20', to: `/courses/${chapter.id}` },
    ...subjectCourses.map(course => ({ ...course, to: `/subjects/${course.id}` })),
  ];
}

export const assignmentsByGrade = {
  m4: [
    { id: '1', title: 'แบบฝึกหัด: เซตจำกัดและอนันต์', course: 'เซตและตรรกศาสตร์', level: 'พื้นฐาน', deadline: '2026-10-03T23:59:00+07:00', status: 'pending', maxScore: 20, description: 'เขียนเซตที่กำหนดแบบแจกแจงสมาชิกและแบบบอกเงื่อนไข พร้อมจำแนกเซตจำกัด เซตอนันต์ และเซตว่าง แสดงเหตุผลประกอบคำตอบทุกข้อ' },
    { id: '2', title: 'สอบย่อย: การดำเนินการของเซต', course: 'เซตและตรรกศาสตร์', level: 'พื้นฐาน', deadline: '2026-09-30T23:59:00+07:00', status: 'completed', maxScore: 20, score: 18, description: 'ทบทวนการหายูเนียน อินเตอร์เซกชัน คอมพลีเมนต์ และผลต่างของเซต โดยใช้แผนภาพเวนน์ประกอบ' },
  ],
  m5: [
    { id: '3', title: 'โจทย์ประยุกต์: ลอการิทึม', course: 'ฟังก์ชันเอกซ์โพเนนเชียล', level: 'เพิ่มเติม', deadline: '2026-10-03T23:59:00+07:00', status: 'pending', maxScore: 20, description: 'ใช้สมบัติของลอการิทึมเพื่อแก้สมการและโจทย์ประยุกต์ จำนวน 10 ข้อ แสดงวิธีทำอย่างละเอียดและตรวจสอบเงื่อนไขของคำตอบ' },
    { id: '4', title: 'แบบฝึกหัด: กฎของไซน์และโคไซน์', course: 'ตรีโกณมิติประยุกต์', level: 'เพิ่มเติม', deadline: '2026-10-05T23:59:00+07:00', status: 'pending', maxScore: 20, description: 'หาด้านและมุมของสามเหลี่ยมโดยใช้กฎของไซน์และกฎของโคไซน์ จำนวน 10 ข้อ พร้อมวาดรูปและระบุข้อมูลที่ใช้ในการคำนวณ' },
  ],
  m6: [
    { id: '5', title: 'แบบฝึกหัด: สถิติเบื้องต้น', course: 'สถิติและข้อมูล', level: 'พื้นฐาน', deadline: '2026-09-30T23:59:00+07:00', status: 'completed', maxScore: 20, score: 19, description: 'หาค่าเฉลี่ย มัธยฐาน และฐานนิยมจากชุดข้อมูล พร้อมอธิบายว่าค่าใดเหมาะสมในการเป็นตัวแทนของข้อมูล' },
    { id: '6', title: 'สอบย่อย: ลิมิต', course: 'แคลคูลัส', level: 'เพิ่มเติม', deadline: '2026-10-06T23:59:00+07:00', status: 'pending', maxScore: 20, description: 'หาลิมิตของฟังก์ชันพหุนามและฟังก์ชันตรรกยะ จำนวน 10 ข้อ โดยแสดงวิธีคำนวณและอธิบายกรณีที่ไม่มีลิมิต' },
  ],
};

export const allAssignments = Object.values(assignmentsByGrade).flat();
export const formatDate = date => new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date(date));
