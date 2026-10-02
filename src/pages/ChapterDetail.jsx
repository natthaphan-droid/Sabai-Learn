import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { ArrowLeft, PlayCircle, BookOpen, FileText } from "lucide-react";
import { mathCurriculum } from "../data/curriculum";
import { ProgressBar } from "../components/ui/ProgressBar";

export default function ChapterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ค้นหาข้อมูลรายวิชาจากฐานข้อมูลหลัก
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

  if (!courseData) {
    return (
      <div className="text-center py-20">
        <h2>ไม่พบข้อมูลบทเรียน</h2>
        <button onClick={() => navigate('/courses')} className="text-primary mt-4 underline">กลับไปหน้ารายวิชา</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> กลับไปหน้ารายวิชา
      </button>

      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
        <span className="text-sm font-bold text-primary mb-2 block">{subjectLabel}</span>
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-4">{courseData.title}</h1>
        <p className="text-textSecondary text-sm md:text-base leading-relaxed max-w-3xl">
          {courseData.description}
        </p>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          เลือกหัวข้อย่อยเพื่อเข้าเรียน
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseData.topics.map((topic, index) => {
            const videoCount = topic.videos?.length || 0;

            return (
              <Card
                key={topic.id}
                className="hover:shadow-card hover:border-primary/30 transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => navigate(`/courses/${courseData.id}/topic/${topic.id}`)}
              >
                <div>
                  <h3 className="font-bold text-lg text-textPrimary group-hover:text-primary transition-colors mb-2">
                    {topic.name}
                  </h3>
                  <div className="flex gap-4 mb-4">
                    <span className="text-xs font-medium text-textSecondary flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      <PlayCircle className="w-3.5 h-3.5" /> {videoCount} คลิป
                    </span>
                    <span className="text-xs font-medium text-textSecondary flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      <FileText className="w-3.5 h-3.5" /> 1 เอกสาร / 1 ใบงาน
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <div className="w-full mr-4 space-y-1">
                    <div className="flex justify-between text-[10px] text-textSecondary font-bold">
                      <span>ความคืบหน้า</span>
                      <span>0%</span>
                    </div>
                    <ProgressBar value={0} />
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
