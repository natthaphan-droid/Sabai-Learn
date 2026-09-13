import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge } from "../components/ui/Badge";
import { Book, Clock, CheckCircle, TrendingUp, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const summary = [
    { label: "วิชาที่กำลังเรียน", value: "6", icon: Book, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "งานที่ต้องส่ง", value: "3", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "งานที่ส่งแล้ว", value: "12", icon: CheckCircle, color: "text-green-500", bg: "bg-green-100" },
    { label: "คะแนนเฉลี่ย", value: "85%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/20" },
  ];

  const courses = [
    { id: 1, name: "คณิตศาสตร์เพิ่มเติม", teacher: "ครูสมคิด รักเรียน", lessons: 12, progress: 65, score: "15/20" },
    { id: 2, name: "วิทยาศาสตร์กายภาพ", teacher: "ครูมาลี แสงดาว", lessons: 8, progress: 40, score: "8/10" },
    { id: 3, name: "ภาษาไทยพื้นฐาน", teacher: "ครูใจดี มีสุข", lessons: 15, progress: 85, score: "42/50" },
    { id: 4, name: "ภาษาอังกฤษสื่อสาร", teacher: "Teacher John Doe", lessons: 10, progress: 20, score: "10/100" },
  ];

  const assignments = [
    { id: 1, title: "แบบฝึกหัดสมการเชิงเส้น", course: "คณิตศาสตร์เพิ่มเติม", deadline: "พรุ่งนี้, 23:59", status: "warning" },
    { id: 2, title: "สรุปการทดลองเคมี", course: "วิทยาศาสตร์กายภาพ", deadline: "15 ก.ย. 2026", status: "warning" },
    { id: 3, title: "เรียงความเรื่องสั้น", course: "ภาษาไทยพื้นฐาน", deadline: "18 ก.ย. 2026", status: "warning" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Date & Greeting */}
      <div className="md:hidden mb-4">
        <h2 className="text-2xl font-bold text-textPrimary">สวัสดี, น้องนนท์ 👋</h2>
        <p className="text-textSecondary">วันอาทิตย์ที่ 13 กันยายน 2026</p>
      </div>
      <div className="hidden md:block">
        <p className="text-textSecondary font-medium">วันอาทิตย์ที่ 13 กันยายน 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((item, index) => (
          <Card key={index} className="flex flex-col gap-3 p-4 md:p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-textPrimary">{item.value}</p>
              <p className="text-xs md:text-sm text-textSecondary font-medium">{item.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-textPrimary">วิชาของฉัน</h3>
            <button onClick={() => navigate('/courses')} className="text-sm font-medium text-primary hover:underline flex items-center">
              ดูทั้งหมด <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map(course => (
              <Card key={course.id} className="flex flex-col h-full border border-gray-50">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-textPrimary line-clamp-1">{course.name}</h4>
                  </div>
                  <p className="text-sm text-textSecondary mb-4">{course.teacher}</p>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-textSecondary">ความคืบหน้า</span>
                      <span className="text-primary">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} />
                  </div>
                  
                  <div className="flex gap-4 text-sm mb-5">
                    <div>
                      <p className="text-xs text-textSecondary">บทเรียน</p>
                      <p className="font-bold text-textPrimary">{course.lessons}</p>
                    </div>
                    <div>
                      <p className="text-xs text-textSecondary">คะแนนล่าสุด</p>
                      <p className="font-bold text-textPrimary">{course.score}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => navigate('/courses')}
                >
                  เข้าสู่รายวิชา
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Assignments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-textPrimary">ใกล้ถึงกำหนดส่ง</h3>
            <button onClick={() => navigate('/assignments')} className="text-sm font-medium text-primary hover:underline">
              ดูทั้งหมด
            </button>
          </div>
          
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {assignments.map(task => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-textPrimary truncate">{task.title}</h4>
                    <p className="text-xs text-textSecondary truncate">{task.course}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={task.status}>ส่ง {task.deadline}</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0 px-3 py-1.5 text-xs h-auto" onClick={() => navigate(`/assignments/${task.id}`)}>
                    ส่งงาน
                  </Button>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-xs text-textSecondary font-medium">คุณมีอีก 3 งานที่ต้องส่งในสัปดาห์นี้</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
