import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PlayCircle, CheckCircle2, Circle, FileText, Download } from "lucide-react";

export default function Course() {
  const [activeTab, setActiveTab] = useState("lessons");

  const tabs = [
    { id: "lessons", label: "บทเรียน" },
    { id: "worksheets", label: "ใบงาน" },
    { id: "assignments", label: "งานที่มอบหมาย" },
    { id: "scores", label: "คะแนน" },
    { id: "documents", label: "เอกสาร" },
  ];

  const lessons = [
    { id: 1, title: "บทที่ 1 จำนวนและการดำเนินการ", duration: "45 นาที", status: "completed" },
    { id: 2, title: "บทที่ 2 เลขยกกำลัง", duration: "50 นาที", status: "completed" },
    { id: 3, title: "บทที่ 3 สมการ", duration: "1 ชั่วโมง 15 นาที", status: "in-progress" },
    { id: 4, title: "บทที่ 4 ระบบสมการ", duration: "1 ชั่วโมง", status: "locked" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Course Header */}
      <Card className="bg-primary/5 border-none shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-white text-primary text-xs font-bold rounded-lg shadow-sm border border-primary/10">คณิตศาสตร์เพิ่มเติม</span>
              <span className="text-sm text-textSecondary font-medium">ม.4 ภาคเรียนที่ 1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">คณิตศาสตร์เพิ่มเติม (ค31201)</h1>
            <p className="text-textSecondary mb-4">ครูสมคิด รักเรียน • จำนวน 12 บทเรียน</p>
            <p className="text-sm text-textPrimary leading-relaxed max-w-3xl">
              ศึกษาความรู้พื้นฐานเกี่ยวกับจำนวนจริง การดำเนินการของจำนวนจริง เลขยกกำลังที่มีเลขชี้กำลังเป็นจำนวนตรรกยะ 
              สมการและอสมการพหุนามตัวแปรเดียว การแก้สมการและอสมการ
            </p>
          </div>
          
          <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 shrink-0">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-textSecondary">ความคืบหน้าการเรียน</span>
              <span className="text-primary font-bold">65%</span>
            </div>
            <ProgressBar value={65} className="mb-4 h-2" />
            <Button className="w-full">ทำเรียนต่อ บทที่ 3</Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
        <div className="flex space-x-6 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold transition-colors relative ${
                activeTab === tab.id ? "text-primary" : "text-textSecondary hover:text-textPrimary"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === "lessons" && (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${lesson.status === 'locked' ? 'opacity-60 bg-gray-50' : 'hover:border-primary/30 border border-transparent'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    {lesson.status === "completed" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {lesson.status === "in-progress" && <PlayCircle className="w-6 h-6 text-primary" />}
                    {lesson.status === "locked" && <Circle className="w-6 h-6 text-gray-300" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${lesson.status === 'locked' ? 'text-gray-500' : 'text-textPrimary'}`}>{lesson.title}</h3>
                    <p className="text-sm text-textSecondary mt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.duration}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant={lesson.status === "completed" ? "outline" : lesson.status === "in-progress" ? "primary" : "ghost"}
                  disabled={lesson.status === "locked"}
                  className="md:w-auto"
                >
                  {lesson.status === "completed" ? "เรียนทบทวน" : lesson.status === "in-progress" ? "เข้าเรียน" : "ยังไม่เปิดให้เรียน"}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "worksheets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <Card key={item} className="p-4 flex items-start gap-4 hover:border-primary/30 border border-transparent transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-softblue/20 flex items-center justify-center shrink-0 text-blue-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-textPrimary">ใบงานที่ {item}: แบบฝึกหัดทบทวน</h3>
                  <p className="text-xs text-textSecondary mt-1">อัปโหลดเมื่อ: 10 ก.ย. 2026 • 1.2 MB</p>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {["assignments", "scores", "documents"].includes(activeTab) && (
          <div className="text-center py-12">
            <p className="text-textSecondary">กำลังโหลดข้อมูล...</p>
          </div>
        )}
      </div>
    </div>
  );
}
