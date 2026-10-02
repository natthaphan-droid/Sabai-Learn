import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Download, Printer } from "lucide-react";
import { mathCurriculum } from "../data/curriculum";
import { topicContents } from "../data/contents";

export default function DocumentReader() {
  const { id, topicId } = useParams();
  const navigate = useNavigate();

  function downloadDocument() {
    const text = document.querySelector('[data-document-content]')?.innerText;
    if (!text) return;
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'สรุปบทเรียน-Sabai-Learn.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ค้นหาข้อมูลรายวิชา
  let courseData = null;
  let subjectLabel = "";

  for (const grade in mathCurriculum) {
    for (const type in mathCurriculum[grade]) {
      const found = mathCurriculum[grade][type].find(c => c.id === id);
      if (found) {
        courseData = found;
        const gradeName = grade === 'm4' ? 'ม.4' : grade === 'm5' ? 'ม.5' : 'ม.6';
        const typeName = type === 'basic' ? 'พื้นฐาน' : 'เพิ่มเติม';
        subjectLabel = `คณิตศาสตร์${typeName} ${gradeName}`;
        break;
      }
    }
    if (courseData) break;
  }

  const topicData = courseData?.topics?.find(t => t.id === topicId);

  if (!courseData || !topicData) {
    return <div className="text-center py-20">ไม่พบข้อมูลเอกสาร</div>;
  }

  return (
    <div className="min-h-screen rounded-2xl bg-[#f0f1eb] p-3 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Toolbar */}
        <div className="bg-white rounded-t-xl p-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              aria-label="กลับไปหน้าบทเรียน"
              onClick={() => navigate(`/courses/${id}/topic/${topicId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">เอกสารสรุป: {topicData.name}</h1>
              <p className="text-xs text-gray-500">{courseData.title} • {subjectLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 tooltip-trigger no-print" title="พิมพ์ / บันทึก PDF" onClick={() => window.print()}>
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 tooltip-trigger no-print" title="ดาวน์โหลดข้อความ (TXT)" onClick={downloadDocument}>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content (Mock PDF view) */}
        <div data-document-content className="document-body bg-white p-5 md:p-12 min-h-[800px] shadow-sm rounded-b-xl">
          <div className="max-w-2xl mx-auto prose prose-blue">
            <div className="text-center mb-10">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
                สรุปเนื้อหา: {topicData.name}
              </h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <p className="lead text-lg font-medium text-gray-800">
                เอกสารฉบับนี้จัดทำขึ้นเพื่อใช้ประกอบการเรียนการสอนในหัวข้อ <strong>{topicData.name}</strong>
              </p>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
                <h3 className="font-bold text-blue-800 mb-2">จุดประสงค์การเรียนรู้</h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-900/80">
                  <li>เข้าใจความหมายและหลักการพื้นฐานของเนื้อหา</li>
                  <li>สามารถประยุกต์ใช้สูตรและทฤษฎีบทในการแก้ปัญหาได้</li>
                </ul>
              </div>

              {/* Render actual content if exists, otherwise render fallback */}
              {topicContents[`${id}-${topicId}`] ? (
                <div className="mt-8">
                  {topicContents[`${id}-${topicId}`]}
                </div>
              ) : (
                <div className="mt-8">
                  <div className="py-12 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                    <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
                    <h3 className="text-gray-500 font-bold mb-1">เนื้อหากำลังอยู่ในระหว่างการจัดทำ</h3>
                    <p className="text-gray-400 text-sm">ส่วนของเอกสารฉบับนี้จะเปิดให้ใช้งานในเร็วๆ นี้</p>
                  </div>
                </div>
              )}

              <hr className="my-10" />

              <div className="text-center text-sm text-gray-400">
                <p>หน้า 1 / 1</p>
                <p>Sabai Learn - Mathematics Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
