import React, { useState, useEffect } from "react";
import { downloadMaterial } from '../data/materials';
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PlayCircle, FileText, ArrowLeft, CheckCircle, Download, PenTool, BookOpen } from "lucide-react";
import { mathCurriculum } from "../data/curriculum";

export default function TopicClassroom() {
  const { id, topicId } = useParams();
  const navigate = useNavigate();

  // 1. ค้นหาบทเรียนและหัวข้อย่อย (เพื่อใช้เป็น initial state ป้องกัน undefined)
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
  const initialVideoId = topicData?.videos?.[0]?.id || null;

  // State สำหรับวิดีโอที่กำลังเล่นอยู่
  const [activeVideoId, setActiveVideoId] = useState(initialVideoId);
  const [isPlaying, setIsPlaying] = useState(false);

  // อัปเดตวิดีโอเมื่อผู้ใช้เปลี่ยนหัวข้อย่อย
  useEffect(() => {
    setActiveVideoId(initialVideoId);
    setIsPlaying(false);
  }, [initialVideoId]);

  // รีเซ็ตการเล่นเมื่อเปลี่ยนคลิป
  useEffect(() => {
    setIsPlaying(false);
  }, [activeVideoId]);

  if (!courseData) {
    return <div className="text-center py-20">ไม่พบข้อมูลบทเรียน</div>;
  }

  if (!topicData) {
    return <div className="text-center py-20">ไม่พบหัวข้อย่อย</div>;
  }

  // ข้อมูลจำลองสำหรับเอกสารและใบงาน (สร้างแบบ Auto ให้สอดคล้องกับหัวข้อ)
  const mockDocument = {
    id: `doc-${topicId}`,
    title: `สไลด์สรุปเนื้อหา: ${topicData.name}`,
    size: "1.2 MB",
    type: "PDF"
  };

  const mockWorksheet = {
    id: `ws-${id}-${topicId}`,
    title: `แบบฝึกหัดทบทวน: ${topicData.name}`,
    deadline: "ไม่มีกำหนด",
    status: "pending"
  };

  const activeVideo = topicData.videos.find(v => v.id === activeVideoId) || topicData.videos[0];

  // จำลอง YouTube ID (สุ่มหรือคงที่) สำหรับการศึกษา
  // ใช้วิดีโอเกี่ยวกับเซต/คณิตศาสตร์เป็นตัวอย่าง

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(`/courses/${id}`)}
        className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> กลับไปหน้ารายการหัวข้อย่อย ({courseData.title})
      </button>

      <div>
        <span className="text-sm font-bold text-primary mb-2 block">{subjectLabel} &gt; {courseData.title}</span>
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">{topicData.name}</h1>
      </div>

      {/* Top Section: Video Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden relative shadow-lg">
            {isPlaying ? (
              <div role="status" className="flex h-full flex-col items-center justify-center gap-3 bg-[#e6ecd9] p-6 text-center text-primary">
                <BookOpen size={36} />
                <h2 className="text-base font-bold">{activeVideo?.title}</h2>
                <p className="text-xs leading-relaxed">วิดีโอตัวอย่างยังไม่เชื่อมต่อกับคลิปจริง<br />เปิดอ่านสรุปบทเรียนและทำใบงานด้านล่างได้</p>
                <button className="text-xs underline underline-offset-4" onClick={() => setIsPlaying(false)}>กลับไปดูรายการคลิป</button>
              </div>
            ) : (
              <button type="button" aria-label={`ดูข้อมูลวิดีโอ ${activeVideo?.title}`}
                className="w-full h-full relative flex items-center justify-center group bg-[#d8e2c9]"
                onClick={() => setIsPlaying(true)}
              >
                <BookOpen className="absolute right-8 top-7 h-20 w-20 text-success/30" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center z-10 shadow-xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 ml-1" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-white flex justify-between items-end z-10">
                  <span className="font-bold text-left text-sm">{activeVideo?.title}<span className="mt-1 block text-[10px] font-normal opacity-70">คลิปตัวอย่าง · ยังไม่เชื่อมต่อวิดีโอจริง</span></span>
                  <span className="text-sm opacity-90">00:00 / {activeVideo?.duration}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Video Playlist within this Topic */}
        <Card className="p-0 overflow-hidden flex flex-col h-full max-h-[350px] lg:max-h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50/80">
            <h3 className="font-bold text-textPrimary">คลิปวิดีโอในหัวข้อนี้</h3>
            <p className="text-xs text-textSecondary mt-1">ทั้งหมด {topicData.videos.length} คลิป</p>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 bg-white">
            {topicData.videos.map((video, idx) => {
              const isActive = video.id === activeVideoId;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isActive ? 'bg-primary/10 border border-primary/20 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {video.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <PlayCircle className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight mb-1 ${isActive ? 'font-bold text-primary' : 'font-medium text-textPrimary'}`}>
                      {idx + 1}. {video.title}
                    </p>
                    <p className="text-xs text-gray-500">{video.duration}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Section: Documents & Worksheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Left: Documents */}
        <Card className="flex flex-col h-full border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg text-textPrimary">เอกสารประกอบการเรียน</h3>
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/courses/${id}/topic/${topicId}/document`)}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-textPrimary line-clamp-2 leading-tight mb-1">{mockDocument.title}</p>
                <p className="text-xs text-textSecondary">{mockDocument.size} • อ่านบนเว็บ</p>
              </div>
              <Button size="sm" variant="ghost" className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                <BookOpen className="w-4 h-4 mr-1" /> อ่านเอกสาร
              </Button>
            </div>
          </div>
        </Card>

        {/* Right: Worksheet */}
        <Card className="flex flex-col h-full border-t-4 border-t-orange-500">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
            <PenTool className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-textPrimary">ใบงานและการบ้าน</h3>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-orange-100 bg-orange-50/30">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-textPrimary line-clamp-2 leading-tight mb-1">{mockWorksheet.title}</p>
                <p className="text-xs text-orange-600 font-medium">{mockWorksheet.deadline}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <a
                href="#"
                onClick={event => { event.preventDefault(); downloadMaterial({ title: mockWorksheet.title, chapter: courseData.title, content: `ทบทวนหัวข้อ ${topicData.name}\n1. เขียนสรุปแนวคิดสำคัญด้วยคำของตนเอง\n2. ยกตัวอย่างโจทย์ 3 ข้อ พร้อมแสดงวิธีทำ\n3. ตรวจทานคำตอบและเขียนชื่อ ชั้น และเลขที่ให้ครบ` }); }}
                className="w-full flex items-center justify-center rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 text-sm font-medium py-2 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" /> โหลดโจทย์ (TXT)
              </a>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0" onClick={() => navigate(`/assignments/${mockWorksheet.id}`)}>
                ส่งใบงาน
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
