import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Mail, Hash, Book, Shield, Bell, LogOut, Edit2, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const registeredCourses = [
    "คณิตศาสตร์เพิ่มเติม (ค31201)",
    "วิทยาศาสตร์กายภาพ (ว31101)",
    "ภาษาไทยพื้นฐาน (ท31101)",
    "ภาษาอังกฤษสื่อสาร (อ31101)",
    "สังคมศึกษา (ส31101)",
    "พลศึกษา (พ31101)"
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-textPrimary mb-6">โปรไฟล์ของฉัน</h1>

      {/* Top Profile Card */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-primary/20 w-full absolute top-0 left-0"></div>
        <div className="relative z-10 pt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?img=11" 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-sm bg-white"
            />
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 shadow-sm transition-transform hover:scale-105">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 pb-2">
            <h2 className="text-2xl font-bold text-textPrimary">ชานนท์ ใจดี (น้องนนท์)</h2>
            <p className="text-textSecondary mt-1">นักเรียนชั้นมัธยมศึกษาปีที่ 4 ห้อง 1</p>
          </div>
          
          <div className="pb-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Edit2 className="w-4 h-4 mr-2" /> แก้ไขโปรไฟล์
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Info & Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-5 border-b border-gray-100 pb-3">ข้อมูลส่วนตัว</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <User className="w-4 h-4" /> ชื่อ-นามสกุล
                </label>
                <Input value="เด็กชาย ชานนท์ ใจดี" readOnly className="bg-gray-50 border-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <Hash className="w-4 h-4" /> รหัสนักเรียน
                </label>
                <Input value="6601234" readOnly className="bg-gray-50 border-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <Mail className="w-4 h-4" /> อีเมล
                </label>
                <Input value="chanon.j@student.ac.th" readOnly className="bg-gray-50 border-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <Book className="w-4 h-4" /> สายการเรียน
                </label>
                <Input value="วิทย์-คณิต" readOnly className="bg-gray-50 border-transparent" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-3">วิชาที่ลงทะเบียนเรียน (เทอมปัจจุบัน)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {registeredCourses.map((course, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Book className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-textPrimary truncate">{course}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-base mb-4 text-textSecondary uppercase tracking-wider">การตั้งค่า</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-textPrimary hover:bg-gray-50">
                <Shield className="w-5 h-5 mr-3 text-gray-400" /> เปลี่ยนรหัสผ่าน
              </Button>
              <Button variant="ghost" className="w-full justify-start text-textPrimary hover:bg-gray-50">
                <Bell className="w-5 h-5 mr-3 text-gray-400" /> ตั้งค่าการแจ้งเตือน
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-red-50 border-red-100">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 font-bold"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" /> ออกจากระบบ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
