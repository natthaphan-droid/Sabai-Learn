export const mathCurriculum = {
  m4: {
    basic: [
      {
        id: "m4-b-1", chapter: "บทที่ 1", title: "เซต (Sets)", progress: 0,
        description: "ทำความรู้จักกับความหมายของเซต การเขียนเซต ประเภทของเซต ไปจนถึงสับเซต พาวเวอร์เซต และการดำเนินการของเซต พร้อมโจทย์ประยุกต์จัดเต็ม",
        topics: [
          { id: "t1", name: "1. ความหมายของเซต", videos: [{ id: 101, title: "ความหมายและข้อตกลงเบื้องต้น", duration: "10:15", completed: false }] },
          { id: "t2", name: "2. การเขียนเซต", videos: [{ id: 102, title: "แบบแจกแจงสมาชิกและแบบบอกเงื่อนไข", duration: "15:30", completed: false }] },
          { id: "t3", name: "3. ชนิดของเซต", videos: [{ id: 103, title: "เซตจำกัด เซตอนันต์ และเซตว่าง", duration: "12:45", completed: false }] },
          { id: "t4", name: "4. เซตที่เท่ากัน", videos: [{ id: 104, title: "การเท่ากันของเซตและการเทียบเท่า", duration: "11:20", completed: false }] },
          { id: "t5", name: "5. สับเซต", videos: [{ id: 105, title: "บทนิยามและสมบัติของสับเซต", duration: "18:00", completed: false }] },
          { id: "t6", name: "6. พาวเวอร์เซต", videos: [{ id: 106, title: "การหาพาวเวอร์เซตและจำนวนสมาชิก", duration: "20:15", completed: false }] },
          { id: "t7", name: "7. เอกภพสัมพัทธ์และแผนภาพเวนน์", videos: [{ id: 107, title: "การวาดแผนภาพเวนน์-ออยเลอร์", duration: "16:40", completed: false }] },
          { id: "t8", name: "8. การดำเนินการ: ยูเนียน", videos: [{ id: 108, title: "ยูเนียน (Union) ของเซต", duration: "14:10", completed: false }] },
          { id: "t9", name: "9. การดำเนินการ: อินเตอร์เซกชัน", videos: [{ id: 109, title: "อินเตอร์เซกชัน (Intersection) ของเซต", duration: "14:50", completed: false }] },
          { id: "t10", name: "10. การดำเนินการ: คอมพลีเมนต์และผลต่าง", videos: [{ id: 110, title: "คอมพลีเมนต์และผลต่างของเซต", duration: "19:20", completed: false }] },
          { id: "t11", name: "11. การหาจำนวนสมาชิกของเซตจำกัด", videos: [{ id: 111, title: "โจทย์ปัญหาเซตและสูตรจำนวนสมาชิก", duration: "35:00", completed: false }] }
        ],
        documents: [{ id: 1, title: "สไลด์ประกอบการสอน บทที่ 1", size: "2.4 MB" }, { id: 2, title: "ใบสรุปสูตร เซต", size: "1.1 MB" }]
      },
      {
        id: "m4-b-2", chapter: "บทที่ 2", title: "ตรรกศาสตร์ (Logic)", progress: 0,
        description: "ทำความเข้าใจประพจน์ การเชื่อมประพจน์ ตารางค่าความจริง สัจนิรันดร์ และตัวบ่งปริมาณแบบครบถ้วน",
        topics: [
          { id: "t1", name: "1. ประพจน์", videos: [{ id: 201, title: "ความหมายของประพจน์", duration: "12:00", completed: false }] },
          { id: "t2", name: "2. การเชื่อมประพจน์", videos: [{ id: 202, title: "ตัวเชื่อม และ, หรือ, ถ้า...แล้ว, ก็ต่อเมื่อ", duration: "22:15", completed: false }] },
          { id: "t3", name: "3. นิเสธของประพจน์", videos: [{ id: 203, title: "การหานิเสธ", duration: "10:30", completed: false }] },
          { id: "t4", name: "4. ตารางค่าความจริง", videos: [{ id: 204, title: "การสร้างตารางค่าความจริง", duration: "28:30", completed: false }] },
          { id: "t5", name: "5. ประพจน์ที่สมมูลกัน", videos: [{ id: 205, title: "รูปแบบประพจน์ที่สมมูลกัน", duration: "35:10", completed: false }] },
          { id: "t6", name: "6. สัจนิรันดร์", videos: [{ id: 206, title: "การตรวจสอบสัจนิรันดร์", duration: "25:40", completed: false }] },
          { id: "t7", name: "7. การอ้างเหตุผล", videos: [{ id: 207, title: "ความสมเหตุสมผลของการอ้างเหตุผล", duration: "30:00", completed: false }] },
          { id: "t8", name: "8. ประโยคเปิด", videos: [{ id: 208, title: "ความหมายและลักษณะของประโยคเปิด", duration: "15:20", completed: false }] },
          { id: "t9", name: "9. ตัวบ่งปริมาณ", videos: [{ id: 209, title: "ตัวบ่งปริมาณ for all และ for some", duration: "22:00", completed: false }] },
          { id: "t10", name: "10. ค่าความจริงของตัวบ่งปริมาณ", videos: [{ id: 210, title: "การหาค่าความจริงของประโยคที่มีตัวบ่งปริมาณ", duration: "28:45", completed: false }] }
        ],
        documents: [{ id: 1, title: "ตารางค่าความจริงและสมมูล", size: "0.8 MB" }]
      },
      {
        id: "m4-b-3", chapter: "บทที่ 3", title: "หลักการนับเบื้องต้น", progress: 0,
        description: "เรียนรู้กฎเกณฑ์เบื้องต้นเกี่ยวกับการนับ การจัดหมู่ การเรียงสับเปลี่ยน และการประยุกต์ใช้",
        topics: [
          { id: "t1", name: "1. แผนภาพต้นไม้", videos: [{ id: 301, title: "การนับด้วยแผนภาพต้นไม้", duration: "15:00", completed: false }] },
          { id: "t2", name: "2. กฎการบวก", videos: [{ id: 302, title: "หลักการบวก", duration: "12:30", completed: false }] },
          { id: "t3", name: "3. กฎการคูณ", videos: [{ id: 303, title: "หลักการคูณและการประยุกต์", duration: "20:00", completed: false }] },
          { id: "t4", name: "4. แฟกทอเรียล (n!)", videos: [{ id: 304, title: "บทนิยามและการคำนวณแฟกทอเรียล", duration: "18:15", completed: false }] },
          { id: "t5", name: "5. การเรียงสับเปลี่ยนเชิงเส้น", videos: [{ id: 305, title: "วิธีเรียงสับเปลี่ยนเชิงเส้นสิ่งของที่แตกต่างกัน", duration: "25:40", completed: false }] },
          { id: "t6", name: "6. การจัดหมู่", videos: [{ id: 306, title: "วิธีจัดหมู่และการเลือกสิ่งของ", duration: "30:20", completed: false }] }
        ],
        documents: []
      }
    ],
    additional: [
      {
        id: "m4-a-1", chapter: "บทที่ 1", title: "ระบบจำนวนจริง", progress: 0,
        description: "สมบัติของจำนวนจริง การแก้สมการและอสมการพหุนาม ค่าสัมบูรณ์",
        topics: [
          { id: "t1", name: "1. โครงสร้างจำนวนจริง", videos: [{ id: 401, title: "ผังโครงสร้างของระบบจำนวนจริง", duration: "12:00", completed: false }] },
          { id: "t2", name: "2. สมบัติของจำนวนจริง", videos: [{ id: 402, title: "สมบัติการบวกและการคูณ", duration: "18:30", completed: false }] },
          { id: "t3", name: "3. พหุนามตัวแปรเดียว", videos: [{ id: 403, title: "การบวกลบคูณหารพหุนาม", duration: "22:15", completed: false }] },
          { id: "t4", name: "4. การแยกตัวประกอบ", videos: [{ id: 404, title: "การแยกตัวประกอบพหุนามดีกรีสองและสูงกว่า", duration: "35:00", completed: false }] },
          { id: "t5", name: "5. ทฤษฎีบทเศษเหลือ", videos: [{ id: 405, title: "ทฤษฎีบทเศษเหลือและทฤษฎีบทตัวประกอบ", duration: "28:40", completed: false }] },
          { id: "t6", name: "6. สมการพหุนาม", videos: [{ id: 406, title: "การแก้สมการพหุนามตัวแปรเดียว", duration: "40:00", completed: false }] },
          { id: "t7", name: "7. สมบัติการไม่เท่ากัน", videos: [{ id: 407, title: "สมบัติของอสมการ", duration: "15:20", completed: false }] },
          { id: "t8", name: "8. การแก้อสมการพหุนาม", videos: [{ id: 408, title: "การใช้เส้นจำนวนแก้อสมการ", duration: "38:00", completed: false }] },
          { id: "t9", name: "9. ค่าสัมบูรณ์", videos: [{ id: 409, title: "นิยามและสมบัติของค่าสัมบูรณ์", duration: "20:10", completed: false }] },
          { id: "t10", name: "10. สมการค่าสัมบูรณ์", videos: [{ id: 410, title: "การแก้สมการที่มีค่าสัมบูรณ์", duration: "25:30", completed: false }] },
          { id: "t11", name: "11. อสมการค่าสัมบูรณ์", videos: [{ id: 411, title: "การแก้อสมการที่มีค่าสัมบูรณ์", duration: "30:45", completed: false }] }
        ],
        documents: [{ id: 1, title: "รวมโจทย์ระบบจำนวนจริง", size: "3.2 MB" }]
      },
      {
        id: "m4-a-2", chapter: "บทที่ 2", title: "ความสัมพันธ์และฟังก์ชัน", progress: 0,
        description: "คู่อันดับ ความสัมพันธ์ โดเมน เรนจ์ ฟังก์ชันประกอบ และฟังก์ชันผกผัน",
        topics: [
          { id: "t1", name: "1. คู่อันดับและผลคูณคาร์ทีเซียน", videos: [{ id: 421, title: "ความหมายและการหาผลคูณคาร์ทีเซียน", duration: "18:00", completed: false }] },
          { id: "t2", name: "2. ความสัมพันธ์", videos: [{ id: 422, title: "นิยามของความสัมพันธ์", duration: "15:30", completed: false }] },
          { id: "t3", name: "3. โดเมนและเรนจ์ (ความสัมพันธ์)", videos: [{ id: 423, title: "การหาโดเมนและเรนจ์ของความสัมพันธ์", duration: "28:40", completed: false }] },
          { id: "t4", name: "4. อินเวอร์สของความสัมพันธ์", videos: [{ id: 424, title: "การหาความสัมพันธ์ผกผัน", duration: "20:15", completed: false }] },
          { id: "t5", name: "5. ความหมายของฟังก์ชัน", videos: [{ id: 425, title: "นิยามและการตรวจสอบฟังก์ชัน", duration: "22:00", completed: false }] },
          { id: "t6", name: "6. โดเมนและเรนจ์ (ฟังก์ชัน)", videos: [{ id: 426, title: "การหาโดเมนและเรนจ์ของฟังก์ชัน", duration: "30:00", completed: false }] },
          { id: "t7", name: "7. ฟังก์ชันเชิงเส้นและกำลังสอง", videos: [{ id: 427, title: "กราฟของฟังก์ชันพื้นฐาน", duration: "25:30", completed: false }] },
          { id: "t8", name: "8. พีชคณิตของฟังก์ชัน", videos: [{ id: 428, title: "การบวกลบคูณหารฟังก์ชัน", duration: "20:00", completed: false }] },
          { id: "t9", name: "9. ฟังก์ชันประกอบ", videos: [{ id: 429, title: "การหา Composite Function (fog, gof)", duration: "32:10", completed: false }] },
          { id: "t10", name: "10. ฟังก์ชันผกผัน", videos: [{ id: 430, title: "การหา Inverse Function", duration: "35:45", completed: false }] }
        ],
        documents: []
      },
      {
        id: "m4-a-3", chapter: "บทที่ 3", title: "เรขาคณิตวิเคราะห์และภาคตัดกรวย", progress: 0,
        description: "ระยะห่างระหว่างจุด ความชัน เส้นตรง วงกลม วงรี พาราโบลา และไฮเพอร์โบลา",
        topics: [
          { id: "t1", name: "1. ระยะทางระหว่างจุดสองจุด", videos: [{ id: 441, title: "สูตรหาระยะทาง", duration: "15:20", completed: false }] },
          { id: "t2", name: "2. จุดกึ่งกลาง", videos: [{ id: 442, title: "การหาพิกัดจุดกึ่งกลาง", duration: "12:10", completed: false }] },
          { id: "t3", name: "3. ความชันของเส้นตรง", videos: [{ id: 443, title: "การหาความชัน", duration: "18:30", completed: false }] },
          { id: "t4", name: "4. เส้นขนานและเส้นตั้งฉาก", videos: [{ id: 444, title: "ความสัมพันธ์ของความชัน", duration: "20:00", completed: false }] },
          { id: "t5", name: "5. สมการเส้นตรง", videos: [{ id: 445, title: "การสร้างและวาดกราฟเส้นตรง", duration: "28:15", completed: false }] },
          { id: "t6", name: "6. ระยะห่างระหว่างจุดกับเส้นตรง", videos: [{ id: 446, title: "สูตรระยะห่างและเส้นคู่ขนาน", duration: "22:40", completed: false }] },
          { id: "t7", name: "7. วงกลม", videos: [{ id: 447, title: "สมการมาตรฐานและรูปทั่วไปของวงกลม", duration: "35:00", completed: false }] },
          { id: "t8", name: "8. พาราโบลา", videos: [{ id: 448, title: "ส่วนประกอบและสมการพาราโบลา", duration: "40:20", completed: false }] },
          { id: "t9", name: "9. วงรี", videos: [{ id: 449, title: "ส่วนประกอบและสมการวงรี", duration: "42:15", completed: false }] },
          { id: "t10", name: "10. ไฮเพอร์โบลา", videos: [{ id: 450, title: "ส่วนประกอบและสมการไฮเพอร์โบลา", duration: "45:30", completed: false }] }
        ],
        documents: []
      }
    ]
  },
  m5: {
    basic: [
      {
        id: "m5-b-1", chapter: "บทที่ 1", title: "เลขยกกำลัง", progress: 0,
        description: "สมบัติของเลขยกกำลัง รากที่ n และเลขยกกำลังที่มีเลขชี้กำลังเป็นจำนวนตรรกยะ",
        topics: [
          { id: "t1", name: "1. สมบัติของเลขยกกำลัง", videos: [{ id: 501, title: "ทบทวนสมบัติเลขยกกำลัง", duration: "25:00", completed: false }] },
          { id: "t2", name: "2. กรณฑ์ที่สองและรากที่ n", videos: [{ id: 502, title: "การหารากที่ n", duration: "32:00", completed: false }] },
          { id: "t3", name: "3. การบวกลบคูณหารราก", videos: [{ id: 503, title: "การดำเนินการของจำนวนที่ติดกรณฑ์", duration: "28:15", completed: false }] },
          { id: "t4", name: "4. เลขชี้กำลังเป็นจำนวนตรรกยะ", videos: [{ id: 504, title: "การเปลี่ยนรากเป็นเลขยกกำลัง", duration: "20:40", completed: false }] }
        ],
        documents: []
      },
      {
        id: "m5-b-2", chapter: "บทที่ 2", title: "ลำดับและอนุกรม", progress: 0,
        description: "ลำดับเลขคณิต ลำดับเรขาคณิต อนุกรมเลขคณิตและอนุกรมเรขาคณิต",
        topics: [
          { id: "t1", name: "1. ความหมายของลำดับ", videos: [{ id: 511, title: "ลำดับคืออะไร", duration: "15:20", completed: false }] },
          { id: "t2", name: "2. ลำดับเลขคณิต", videos: [{ id: 512, title: "พจน์ทั่วไปของลำดับเลขคณิต", duration: "28:00", completed: false }] },
          { id: "t3", name: "3. ลำดับเรขาคณิต", videos: [{ id: 513, title: "พจน์ทั่วไปของลำดับเรขาคณิต", duration: "30:00", completed: false }] },
          { id: "t4", name: "4. ความหมายของอนุกรม", videos: [{ id: 514, title: "ซิกมา (Sigma) เบื้องต้น", duration: "18:45", completed: false }] },
          { id: "t5", name: "5. อนุกรมเลขคณิต", videos: [{ id: 515, title: "ผลบวก n พจน์แรกของอนุกรมเลขคณิต", duration: "35:10", completed: false }] },
          { id: "t6", name: "6. อนุกรมเรขาคณิต", videos: [{ id: 516, title: "ผลบวก n พจน์แรกของอนุกรมเรขาคณิต", duration: "38:20", completed: false }] }
        ],
        documents: []
      }
    ],
    additional: [
      {
        id: "m5-a-1", chapter: "บทที่ 1", title: "ฟังก์ชันเอกซ์โพเนนเชียลและลอการิทึม", progress: 0,
        description: "ฟังก์ชันเอกซ์โพเนนเชียล กราฟ การแก้สมการและอสมการเอกซ์โพฯ ฟังก์ชันลอการิทึม",
        topics: [
          { id: "t1", name: "1. ฟังก์ชันเอกซ์โพเนนเชียล", videos: [{ id: 521, title: "นิยามและกราฟฟังก์ชันเอกซ์โพเนนเชียล", duration: "25:00", completed: false }] },
          { id: "t2", name: "2. สมการเอกซ์โพเนนเชียล", videos: [{ id: 522, title: "เทคนิคการแก้สมการเอกซ์โพเนนเชียล", duration: "35:10", completed: false }] },
          { id: "t3", name: "3. อสมการเอกซ์โพเนนเชียล", videos: [{ id: 523, title: "การแก้อสมการเอกซ์โพเนนเชียล", duration: "28:00", completed: false }] },
          { id: "t4", name: "4. ฟังก์ชันลอการิทึม", videos: [{ id: 524, title: "นิยามและกราฟฟังก์ชันลอการิทึม", duration: "22:15", completed: false }] },
          { id: "t5", name: "5. สมบัติลอการิทึม", videos: [{ id: 525, title: "สมบัติที่สำคัญของ Log", duration: "45:00", completed: false }] },
          { id: "t6", name: "6. การเปลี่ยนฐานลอการิทึม", videos: [{ id: 526, title: "สูตรการเปลี่ยนฐาน", duration: "18:20", completed: false }] },
          { id: "t7", name: "7. สมการลอการิทึม", videos: [{ id: 527, title: "การแก้สมการ Log", duration: "50:00", completed: false }] },
          { id: "t8", name: "8. อสมการลอการิทึม", videos: [{ id: 528, title: "การแก้อสมการ Log", duration: "32:40", completed: false }] },
          { id: "t9", name: "9. ลอกสามัญและลอกธรรมชาติ", videos: [{ id: 529, title: "การใช้ตาราง Log และ ln", duration: "24:10", completed: false }] }
        ],
        documents: []
      },
      {
        id: "m5-a-2", chapter: "บทที่ 2", title: "ฟังก์ชันตรีโกณมิติ", progress: 0,
        description: "วงกลมหนึ่งหน่วย อัตราส่วนตรีโกณมิติ กราฟ สูตร และการแก้สมการตรีโกณมิติแบบเจาะลึก",
        topics: [
          { id: "t1", name: "1. มุมและการวัดมุม", videos: [{ id: 531, title: "เรเดียนและองศา", duration: "20:00", completed: false }] },
          { id: "t2", name: "2. วงกลมหนึ่งหน่วย", videos: [{ id: 532, title: "ค่า sin, cos บนวงกลมหนึ่งหน่วย", duration: "40:00", completed: false }] },
          { id: "t3", name: "3. ฟังก์ชันตรีโกณมิติอื่นๆ", videos: [{ id: 533, title: "tan, cosec, sec, cot", duration: "25:30", completed: false }] },
          { id: "t4", name: "4. กราฟของฟังก์ชันตรีโกณมิติ", videos: [{ id: 534, title: "การวาดและวิเคราะห์กราฟ", duration: "35:15", completed: false }] },
          { id: "t5", name: "5. มุมผลบวกผลต่าง", videos: [{ id: 535, title: "สูตร sin(A±B), cos(A±B), tan(A±B)", duration: "45:00", completed: false }] },
          { id: "t6", name: "6. มุมสองเท่าและครึ่งเท่า", videos: [{ id: 536, title: "สูตรมุม 2A, 3A และ A/2", duration: "38:40", completed: false }] },
          { id: "t7", name: "7. อินเวอร์สฟังก์ชันตรีโกณมิติ", videos: [{ id: 537, title: "arcsin, arccos, arctan", duration: "42:00", completed: false }] },
          { id: "t8", name: "8. เอกลักษณ์ตรีโกณมิติ", videos: [{ id: 538, title: "การพิสูจน์เอกลักษณ์", duration: "30:20", completed: false }] },
          { id: "t9", name: "9. สมการตรีโกณมิติ", videos: [{ id: 539, title: "การหาคำตอบทั่วไปของสมการ", duration: "48:00", completed: false }] },
          { id: "t10", name: "10. กฎของไซน์และโคไซน์", videos: [{ id: 540, title: "การแก้โจทย์สามเหลี่ยม", duration: "38:00", completed: false }] }
        ],
        documents: []
      },
      {
        id: "m5-a-3", chapter: "บทที่ 3", title: "เวกเตอร์ในสามมิติ", progress: 0,
        description: "ระบบพิกัดฉากสามมิติ เวกเตอร์เบื้องต้น ดอทโปรดักต์ ครอสโปรดักต์",
        topics: [
          { id: "t1", name: "1. เวกเตอร์เบื้องต้น", videos: [{ id: 551, title: "นิยามและการขนานกันของเวกเตอร์", duration: "18:00", completed: false }] },
          { id: "t2", name: "2. การบวกลบเวกเตอร์", videos: [{ id: 552, title: "การบวกลบเชิงเรขาคณิต", duration: "22:30", completed: false }] },
          { id: "t3", name: "3. เวกเตอร์ในระบบพิกัดฉาก", videos: [{ id: 553, title: "พิกัด 2 มิติ และ 3 มิติ", duration: "30:00", completed: false }] },
          { id: "t4", name: "4. ขนาดและทิศทาง", videos: [{ id: 554, title: "การหาขนาดและโคไซน์แสดงทิศทาง", duration: "25:40", completed: false }] },
          { id: "t5", name: "5. ผลคูณเชิงสเกลาร์ (Dot Product)", videos: [{ id: 555, title: "นิยามและสมบัติของ Dot Product", duration: "35:10", completed: false }] },
          { id: "t6", name: "6. ผลคูณเชิงเวกเตอร์ (Cross Product)", videos: [{ id: 556, title: "นิยามและสมบัติของ Cross Product", duration: "38:20", completed: false }] }
        ],
        documents: []
      }
    ]
  },
  m6: {
    basic: [
      {
        id: "m6-b-1", chapter: "บทที่ 1", title: "สถิติและข้อมูล", progress: 0,
        description: "ชนิดของข้อมูล การนำเสนอข้อมูล การหาค่ากลาง และการวัดการกระจายของข้อมูล",
        topics: [
          { id: "t1", name: "1. ความหมายของสถิติและข้อมูล", videos: [{ id: 601, title: "ประชากร ตัวอย่าง และประเภทข้อมูล", duration: "20:00", completed: false }] },
          { id: "t2", name: "2. การแจกแจงความถี่", videos: [{ id: 602, title: "ตารางแจกแจงความถี่", duration: "25:15", completed: false }] },
          { id: "t3", name: "3. กราฟทางสถิติ", videos: [{ id: 603, title: "ฮิสโทแกรมและรูปหลายเหลี่ยมความถี่", duration: "18:40", completed: false }] },
          { id: "t4", name: "4. ค่าเฉลี่ยเลขคณิต", videos: [{ id: 604, title: "การหาค่าเฉลี่ยแบบไม่แจกแจงและแจกแจง", duration: "35:00", completed: false }] },
          { id: "t5", name: "5. มัธยฐาน", videos: [{ id: 605, title: "การหามัธยฐาน", duration: "28:30", completed: false }] },
          { id: "t6", name: "6. ฐานนิยม", videos: [{ id: 606, title: "การหาฐานนิยม", duration: "22:10", completed: false }] },
          { id: "t7", name: "7. เปอร์เซ็นไทล์ เดไซล์ ควอร์ไทล์", videos: [{ id: 607, title: "การวัดตำแหน่งที่ของข้อมูล", duration: "42:00", completed: false }] },
          { id: "t8", name: "8. พิสัยและส่วนเบี่ยงเบนมาตรฐาน", videos: [{ id: 608, title: "การวัดการกระจายสัมบูรณ์", duration: "45:00", completed: false }] }
        ],
        documents: []
      }
    ],
    additional: [
      {
        id: "m6-a-1", chapter: "บทที่ 1", title: "แคลคูลัสเบื้องต้น", progress: 0,
        description: "ลิมิตและความต่อเนื่องของฟังก์ชัน อนุพันธ์ และปริพันธ์ (อินทิเกรต)",
        topics: [
          { id: "t1", name: "1. ลิมิตของฟังก์ชัน", videos: [{ id: 611, title: "การหาลิมิตด้วยกราฟและการคำนวณ", duration: "35:00", completed: false }] },
          { id: "t2", name: "2. ความต่อเนื่องของฟังก์ชัน", videos: [{ id: 612, title: "เงื่อนไขความต่อเนื่อง 3 ข้อ", duration: "25:20", completed: false }] },
          { id: "t3", name: "3. อนุพันธ์ของฟังก์ชัน", videos: [{ id: 613, title: "นิยามของอนุพันธ์ (Limit Definition)", duration: "28:10", completed: false }] },
          { id: "t4", name: "4. สูตรหาอนุพันธ์", videos: [{ id: 614, title: "สูตรดิฟเฟอเรนชิเอตพื้นฐาน", duration: "40:00", completed: false }] },
          { id: "t5", name: "5. กฎลูกโซ่ (Chain Rule)", videos: [{ id: 615, title: "อนุพันธ์ของฟังก์ชันประกอบ", duration: "32:30", completed: false }] },
          { id: "t6", name: "6. ความชันของเส้นโค้ง", videos: [{ id: 616, title: "สมการเส้นสัมผัสเส้นโค้ง", duration: "38:40", completed: false }] },
          { id: "t7", name: "7. ค่าสูงสุดและต่ำสุดสัมพัทธ์", videos: [{ id: 617, title: "การใช้ดิฟหาค่าวิกฤตและจุดสูงสุด/ต่ำสุด", duration: "45:15", completed: false }] },
          { id: "t8", name: "8. การประยุกต์อนุพันธ์", videos: [{ id: 618, title: "โจทย์ปัญหาค่าสูงสุดและต่ำสุด", duration: "50:00", completed: false }] },
          { id: "t9", name: "9. ปริพันธ์ไม่จำกัดเขต", videos: [{ id: 619, title: "สูตรอินทิเกรตเบื้องต้น", duration: "35:20", completed: false }] },
          { id: "t10", name: "10. ปริพันธ์จำกัดเขตและพื้นที่ใต้กราฟ", videos: [{ id: 620, title: "การหาพื้นที่ปิดล้อมด้วยเส้นโค้ง", duration: "48:00", completed: false }] }
        ],
        documents: [{ id: 1, title: "สูตรแคลคูลัส (Diff & Integrate)", size: "1.5 MB" }]
      },
      {
        id: "m6-a-2", chapter: "บทที่ 2", title: "ความน่าจะเป็น (ประยุกต์)", progress: 0,
        description: "ทฤษฎีบททวินาม ตัวแปรสุ่ม และการแจกแจงความน่าจะเป็นชนิดต่างๆ",
        topics: [
          { id: "t1", name: "1. ทบทวนกฎการนับและความน่าจะเป็น", videos: [{ id: 621, title: "ความน่าจะเป็นของเหตุการณ์", duration: "30:00", completed: false }] },
          { id: "t2", name: "2. ตัวแปรสุ่ม", videos: [{ id: 622, title: "ความหมายและชนิดของตัวแปรสุ่ม", duration: "22:15", completed: false }] },
          { id: "t3", name: "3. การแจกแจงความน่าจะเป็นแบบไม่ต่อเนื่อง", videos: [{ id: 623, title: "การแจกแจงทวินาม", duration: "45:00", completed: false }] },
          { id: "t4", name: "4. การแจกแจงความน่าจะเป็นแบบต่อเนื่อง", videos: [{ id: 624, title: "การแจกแจงปกติและค่า Z", duration: "50:20", completed: false }] }
        ],
        documents: []
      }
    ]
  }
};
