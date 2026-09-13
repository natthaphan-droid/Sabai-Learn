import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FileText, Calendar, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assignments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "งานทั้งหมด" },
    { id: "pending", label: "รอส่ง" },
    { id: "submitted", label: "ส่งแล้ว" },
    { id: "graded", label: "ตรวจแล้ว" },
    { id: "overdue", label: "เกินกำหนด" },
  ];

  const assignments = [
    { 
      id: 1, title: "แบบฝึกหัดสมการเชิงเส้น", course: "คณิตศาสตร์เพิ่มเติม", teacher: "ครูสมคิด รักเรียน",
      assigned: "10 ก.ย. 2026", deadline: "พรุ่งนี้, 23:59", status: "pending", score: "-"
    },
    { 
      id: 2, title: "สรุปการทดลองเคมีเรื่องกรด-เบส", course: "วิทยาศาสตร์กายภาพ", teacher: "ครูมาลี แสงดาว",
      assigned: "8 ก.ย. 2026", deadline: "15 ก.ย. 2026", status: "pending", score: "-"
    },
    { 
      id: 3, title: "เรียงความเรื่องสั้น", course: "ภาษาไทยพื้นฐาน", teacher: "ครูใจดี มีสุข",
      assigned: "5 ก.ย. 2026", deadline: "10 ก.ย. 2026", status: "submitted", score: "-"
    },
    { 
      id: 4, title: "Worksheet 1: Grammar", course: "ภาษาอังกฤษสื่อสาร", teacher: "Teacher John Doe",
      assigned: "1 ก.ย. 2026", deadline: "7 ก.ย. 2026", status: "graded", score: "9/10"
    },
    { 
      id: 5, title: "รายงานโครงงานวิทยาศาสตร์", course: "วิทยาศาสตร์กายภาพ", teacher: "ครูมาลี แสงดาว",
      assigned: "20 ส.ค. 2026", deadline: "31 ส.ค. 2026", status: "overdue", score: "-"
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <Badge variant="warning">รอส่ง</Badge>;
      case "submitted": return <Badge variant="success">ส่งแล้ว</Badge>;
      case "graded": return <Badge variant="info">ตรวจแล้ว</Badge>;
      case "overdue": return <Badge variant="danger">เกินกำหนด</Badge>;
      default: return <Badge>ไม่ระบุ</Badge>;
    }
  };

  const filteredAssignments = activeTab === "all" 
    ? assignments 
    : assignments.filter(a => a.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">งานที่ได้รับมอบหมาย</h1>
          <p className="text-textSecondary mt-1">จัดการและติดตามงานทั้งหมดของคุณได้ที่นี่</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
        <div className="flex space-x-2 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-transparent text-textSecondary hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center hover:border-primary/40 border border-transparent transition-all cursor-pointer" onClick={() => navigate(`/assignments/${assignment.id}`)}>
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 hidden sm:flex">
              <FileText className="w-6 h-6 text-textSecondary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {getStatusBadge(assignment.status)}
                {assignment.status === 'graded' && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">คะแนน: {assignment.score}</span>
                )}
              </div>
              <h3 className="font-bold text-lg text-textPrimary truncate">{assignment.title}</h3>
              <p className="text-sm text-textSecondary truncate">{assignment.course} • {assignment.teacher}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-xs font-medium text-textSecondary">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>สั่ง: {assignment.assigned}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${assignment.status === 'overdue' ? 'text-red-500' : 'text-gray-500'}`}>
                  <Clock className="w-4 h-4" />
                  <span>กำหนดส่ง: {assignment.deadline}</span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 pt-2 md:pt-0 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto pr-3">
                ดูรายละเอียด <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-textPrimary mb-1">ไม่มีงานในหมวดหมู่นี้</h3>
            <p className="text-textSecondary text-sm">คุณเยี่ยมมาก! จัดการงานได้เรียบร้อยแล้ว</p>
          </div>
        )}
      </div>
    </div>
  );
}
