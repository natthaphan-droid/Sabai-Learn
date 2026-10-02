import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { TabSwitcher } from "../components/ui/TabSwitcher";
import { Award, TrendingUp, BarChart, Download } from "lucide-react";
import { BarChart as ScoreChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../components/ui/Button';
import { useUser } from "../contexts/UserContext";

export default function Score() {
  const { currentGrade, getGradeLabel } = useUser();
  const [activeType, setActiveType] = useState("basic");

  const scoreData = {
    m4: {
      basic: {
        average: "88%", totalCredits: "1.5",
        courses: [
          { id: 1, name: "เซตและตรรกศาสตร์", term: "เทอม 1", score: 85, maxScore: 100, grade: "4.0" },
          { id: 2, name: "จำนวนจริงและพหุนาม", term: "เทอม 1", score: 92, maxScore: 100, grade: "4.0" },
        ]
      },
      additional: {
        average: "82%", totalCredits: "2.0",
        courses: [
          { id: 3, name: "ระบบจำนวนจริง", term: "เทอม 1", score: 78, maxScore: 100, grade: "3.5" },
          { id: 4, name: "เรขาคณิตวิเคราะห์", term: "เทอม 1", score: 86, maxScore: 100, grade: "4.0" },
        ]
      }
    },
    m5: {
      basic: {
        average: "75%", totalCredits: "1.0",
        courses: [
          { id: 5, name: "ลำดับและอนุกรม", term: "เทอม 1", score: 75, maxScore: 100, grade: "3.0" },
        ]
      },
      additional: {
        average: "85%", totalCredits: "2.5",
        courses: [
          { id: 6, name: "ฟังก์ชันเอกซ์โพเนนเชียล", term: "เทอม 1", score: 85, maxScore: 100, grade: "4.0" },
          { id: 7, name: "ฟังก์ชันตรีโกณมิติ", term: "เทอม 1", score: 85, maxScore: 100, grade: "4.0" },
        ]
      }
    },
    m6: {
      basic: {
        average: "90%", totalCredits: "1.0",
        courses: [
          { id: 8, name: "สถิติและข้อมูล", term: "เทอม 1", score: 90, maxScore: 100, grade: "4.0" },
        ]
      },
      additional: {
        average: "78%", totalCredits: "1.5",
        courses: [
          { id: 9, name: "แคลคูลัสเบื้องต้น", term: "เทอม 1", score: 78, maxScore: 100, grade: "3.5" },
        ]
      }
    }
  };

  const currentData = scoreData[currentGrade]?.[activeType] || { average: "0%", totalCredits: "0", courses: [] };

  function exportScores() {
    const rows = [['รายวิชา', 'ภาคเรียน', 'คะแนน', 'คะแนนเต็ม', 'เกรด'], ...currentData.courses.map(course => [course.name, course.term, course.score, course.maxScore, course.grade])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `คะแนน-${getGradeLabel()}-${activeType}.csv`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="greeting-banner rounded-2xl p-6 md:p-8 flex flex-wrap justify-between items-center gap-4">
        <div>
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">สรุปคะแนนผลการเรียน</h1>
        <p className="text-textSecondary text-sm">ติดตามความก้าวหน้าสำหรับชั้น {getGradeLabel()} · ภาคเรียนที่ 1/2569</p>
        </div>
        <Button variant="outline" onClick={exportScores} className="bg-white/70"><Download size={16} />ส่งออกคะแนน (CSV)</Button>
      </div>

      <TabSwitcher activeType={activeType} onTypeChange={setActiveType} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">เกรดเฉลี่ย ({getGradeLabel()} {activeType === 'basic' ? 'พื้นฐาน' : 'เพิ่มเติม'})</p>
            <p className="text-3xl font-bold text-textPrimary">{(currentData.courses.reduce((sum, course) => sum + Number(course.grade), 0) / (currentData.courses.length || 1)).toFixed(2)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">คะแนนเฉลี่ย ({activeType === 'basic' ? 'พื้นฐาน' : 'เพิ่มเติม'})</p>
            <p className="text-2xl font-bold text-textPrimary">{currentData.average}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">หน่วยกิต ({activeType === 'basic' ? 'พื้นฐาน' : 'เพิ่มเติม'})</p>
            <p className="text-2xl font-bold text-textPrimary">{currentData.totalCredits}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="section-title flex items-center gap-3 text-lg font-bold mb-2">พัฒนาการและเปรียบเทียบคะแนน</h2>
        <p className="text-xs text-textSecondary mb-6">คะแนนรายวิชาเทียบกับเป้าหมาย 80 คะแนน · ข้อมูลตัวอย่าง</p>
        <div className="h-[300px] w-full min-w-0" role="img" aria-label={currentData.courses.map(course => `${course.name}: ${course.score} จาก ${course.maxScore} คะแนน`).join(', ')}>
          <ResponsiveContainer width="100%" height="100%">
            <ScoreChart data={currentData.courses.map(course => ({ name: course.name, score: course.score, target: 80 }))} margin={{ top: 15, right: 10, bottom: 15, left: -20 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eaece6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#737a72' }} tickLine={false} axisLine={false} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#737a72' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 14, border: '1px solid #eaece7', fontSize: 12 }} cursor={{ fill: '#f7f8f2' }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 14 }} />
              <Bar dataKey="score" name="คะแนนของฉัน" fill="#7faf8a" radius={[7, 7, 0, 0]} maxBarSize={50} />
              <Bar dataKey="target" name="เป้าหมาย" fill="#e8d789" radius={[7, 7, 0, 0]} maxBarSize={50} />
            </ScoreChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg text-textPrimary">ผลการเรียนรายวิชา</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 text-sm font-bold text-textSecondary">วิชา</th>
                <th className="p-4 text-sm font-bold text-textSecondary">ภาคเรียน</th>
                <th className="p-4 text-sm font-bold text-textSecondary text-center">คะแนนรวม</th>
                <th className="p-4 text-sm font-bold text-textSecondary text-center">เกรด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-textPrimary">{course.name}</p>
                  </td>
                  <td className="p-4 text-sm text-textSecondary">{course.term}</td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-textPrimary">{course.score}</span>
                    <span className="text-textSecondary text-xs">/{course.maxScore}</span>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant={parseFloat(course.grade) >= 3.5 ? "success" : "warning"}>
                      {course.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentData.courses.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p>ไม่มีข้อมูลผลการเรียนในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
