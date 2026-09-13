import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Award, TrendingUp, Target, Star } from "lucide-react";

export default function Score() {
  const summary = [
    { label: "คะแนนเฉลี่ยรวม", value: "3.80", subtext: "เกรดเฉลี่ย (GPA)", icon: Award, color: "text-primary", bg: "bg-primary/20" },
    { label: "คะแนนสะสม", value: "85%", subtext: "ดีเยี่ยม", icon: Target, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "ความก้าวหน้า", value: "+12%", subtext: "เทียบกับเดือนก่อน", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
    { label: "คะแนนพฤติกรรม", value: "100", subtext: "ดีเด่น", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100" },
  ];

  const chartData = [
    { name: "สัปดาห์ 1", score: 75 },
    { name: "สัปดาห์ 2", score: 82 },
    { name: "สัปดาห์ 3", score: 78 },
    { name: "สัปดาห์ 4", score: 88 },
    { name: "สัปดาห์ 5", score: 92 },
    { name: "สัปดาห์ 6", score: 85 },
    { name: "ปัจจุบัน", score: 89 },
  ];

  const scoresList = [
    { id: 1, title: "ใบงานที่ 1: ระบบสมการ", course: "คณิตศาสตร์", fullScore: 10, actualScore: 9, date: "10/09/2026", status: "ตรวจแล้ว" },
    { id: 2, title: "แบบทดสอบย่อย ครั้งที่ 1", course: "วิทยาศาสตร์", fullScore: 20, actualScore: 17, date: "12/09/2026", status: "ตรวจแล้ว" },
    { id: 3, title: "เรียงความวันแม่", course: "ภาษาไทย", fullScore: 15, actualScore: 14, date: "15/08/2026", status: "ตรวจแล้ว" },
    { id: 4, title: "Vocabulary Quiz", course: "ภาษาอังกฤษ", fullScore: 10, actualScore: 10, date: "01/09/2026", status: "ตรวจแล้ว" },
    { id: 5, title: "สอบกลางภาค", course: "คณิตศาสตร์", fullScore: 30, actualScore: "-", date: "รอดำเนินการ", status: "รอตรวจ" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-textPrimary">ผลการเรียนและคะแนน</h1>
        <p className="text-textSecondary mt-1">ติดตามพัฒนาการและผลการเรียนของคุณ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((item, index) => (
          <Card key={index} className="p-4 md:p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="text-sm font-medium text-textSecondary">{item.label}</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-textPrimary">{item.value}</p>
              <p className="text-xs text-textSecondary mt-1">{item.subtext}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">กราฟแสดงพัฒนาการ (คะแนนเฉลี่ย %)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#777' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#777' }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                cursor={{ stroke: '#7FAF8A', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#7FAF8A" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#7FAF8A', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Score Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-lg">รายละเอียดคะแนนล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-textSecondary text-xs uppercase tracking-wider">
                <th className="p-4 font-bold rounded-tl-xl">ชื่องาน</th>
                <th className="p-4 font-bold">วิชา</th>
                <th className="p-4 font-bold text-center">คะแนนเต็ม</th>
                <th className="p-4 font-bold text-center">คะแนนที่ได้</th>
                <th className="p-4 font-bold">วันที่ตรวจ</th>
                <th className="p-4 font-bold rounded-tr-xl">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {scoresList.map((score, index) => (
                <tr key={score.id} className={`border-b border-gray-50 hover:bg-gray-50/30 transition-colors ${index === scoresList.length - 1 ? 'border-none' : ''}`}>
                  <td className="p-4 font-medium text-textPrimary">{score.title}</td>
                  <td className="p-4 text-textSecondary">{score.course}</td>
                  <td className="p-4 text-center text-textSecondary">{score.fullScore}</td>
                  <td className="p-4 text-center font-bold text-primary">{score.actualScore}</td>
                  <td className="p-4 text-textSecondary">{score.date}</td>
                  <td className="p-4">
                    {score.status === "ตรวจแล้ว" ? (
                      <Badge variant="info">ตรวจแล้ว</Badge>
                    ) : (
                      <Badge variant="warning">รอตรวจ</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
