import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Search, Filter, FileText, Download, Eye, FileDown } from "lucide-react";

export default function Worksheets() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "ทั้งหมด" },
    { id: "recent", label: "ล่าสุด" },
    { id: "worksheets", label: "ใบงาน" },
    { id: "documents", label: "เอกสารประกอบการเรียน" },
  ];

  const documents = [
    { id: 1, title: "ใบงานที่ 1: สมการเชิงเส้น", course: "คณิตศาสตร์เพิ่มเติม", type: "worksheet", date: "10 ก.ย. 2026", size: "1.2 MB", ext: "pdf" },
    { id: 2, title: "สไลด์บทที่ 2: โครงสร้างอะตอม", course: "วิทยาศาสตร์กายภาพ", type: "document", date: "8 ก.ย. 2026", size: "4.5 MB", ext: "pdf" },
    { id: 3, title: "สรุปหลักภาษาไทย (ฉบับสอบ)", course: "ภาษาไทยพื้นฐาน", type: "document", date: "5 ก.ย. 2026", size: "2.1 MB", ext: "pdf" },
    { id: 4, title: "Vocabulary List: Unit 1-3", course: "ภาษาอังกฤษสื่อสาร", type: "worksheet", date: "1 ก.ย. 2026", size: "0.8 MB", ext: "doc" },
    { id: 5, title: "เฉลยแบบฝึกหัดบทที่ 1", course: "คณิตศาสตร์เพิ่มเติม", type: "document", date: "28 ส.ค. 2026", size: "3.4 MB", ext: "pdf" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">ใบงานและเอกสาร</h1>
          <p className="text-textSecondary mt-1">ค้นหาและดาวน์โหลดเอกสารประกอบการเรียนต่างๆ</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input className="pl-10 h-12" placeholder="ค้นหาชื่อเอกสาร, รายวิชา..." />
        </div>
        <Button variant="outline" className="h-12 w-full sm:w-auto shrink-0 bg-white">
          <Filter className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">ตัวกรอง</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mt-2">
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

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4 flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all border border-transparent hover:border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${doc.ext === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <FileDown className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-textPrimary text-base line-clamp-2 leading-snug" title={doc.title}>{doc.title}</h3>
                <p className="text-xs text-textSecondary mt-1 truncate">{doc.course}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{doc.date}</span>
                  <span className="text-[10px] font-medium text-gray-400">{doc.size}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
              <Button variant="ghost" className="flex-1 text-xs py-2 bg-gray-50/50 hover:bg-gray-100 h-auto">
                <Eye className="w-4 h-4 mr-1.5" /> ดูตัวอย่าง
              </Button>
              <Button variant="secondary" className="flex-1 text-xs py-2 h-auto text-primary bg-primary/10 hover:bg-primary/20">
                <Download className="w-4 h-4 mr-1.5" /> ดาวน์โหลด
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
