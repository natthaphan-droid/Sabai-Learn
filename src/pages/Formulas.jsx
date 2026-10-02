import React, { useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { TabSwitcher } from "../components/ui/TabSwitcher";
import { BookOpen, Sigma, Calculator, Activity, Variable, X, Download } from "lucide-react";
import { Button } from '../components/ui/Button';
import { downloadMaterial } from '../data/materials';
import { useUser } from "../contexts/UserContext";

export default function Formulas() {
  const { currentGrade: activeGrade } = useUser();
  const [activeType, setActiveType] = useState("basic");
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const notes = {
    1: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)\nจำนวนสับเซตของเซตที่มี n สมาชิก = 2ⁿ\nจำนวนสมาชิกของพาวเวอร์เซต = 2ⁿ',
    2: 'p → q สมมูลกับ ¬p ∨ q\n¬(p ∧ q) สมมูลกับ ¬p ∨ ¬q\n¬(p ∨ q) สมมูลกับ ¬p ∧ ¬q\np ↔ q เป็นจริงเมื่อ p และ q มีค่าความจริงเหมือนกัน',
    3: 'ระยะทาง: d = √((x₂ − x₁)² + (y₂ − y₁)²)\nจุดกึ่งกลาง: ((x₁ + x₂)/2, (y₁ + y₂)/2)\nความชัน: m = (y₂ − y₁)/(x₂ − x₁) เมื่อ x₂ ≠ x₁\nเส้นตรง: y − y₁ = m(x − x₁)',
    4: 'วงกลม: (x − h)² + (y − k)² = r²\nวงรีแนวนอน: (x − h)²/a² + (y − k)²/b² = 1 โดย a > b > 0\nพาราโบลาแกนตั้ง: (x − h)² = 4p(y − k)\nไฮเพอร์โบลาแนวนอน: (x − h)²/a² − (y − k)²/b² = 1',
    5: 'ลำดับเลขคณิต: aₙ = a₁ + (n − 1)d\nอนุกรมเลขคณิต: Sₙ = n(a₁ + aₙ)/2\nลำดับเรขาคณิต: aₙ = a₁rⁿ⁻¹\nอนุกรมเรขาคณิต: Sₙ = a₁(1 − rⁿ)/(1 − r) เมื่อ r ≠ 1',
    6: 'sin²θ + cos²θ = 1\nsin 2θ = 2 sin θ cos θ\ncos 2θ = cos²θ − sin²θ\nกฎของไซน์: a/sin A = b/sin B = c/sin C\nกฎของโคไซน์: c² = a² + b² − 2ab cos C',
    7: 'สำหรับ A = [[a, b], [c, d]]\ndet(A) = ad − bc\nA⁻¹ = (1/(ad − bc)) [[d, −b], [−c, a]]\nเมทริกซ์ผกผันมีได้เมื่อ det(A) ≠ 0\nการคูณ AB ทำได้เมื่อจำนวนหลักของ A เท่ากับจำนวนแถวของ B',
    8: 'เวกเตอร์ u = (u₁, u₂, u₃), v = (v₁, v₂, v₃)\nu · v = u₁v₁ + u₂v₂ + u₃v₃\n|u| = √(u₁² + u₂² + u₃²)\ncos θ = (u · v)/(|u||v|) เมื่อ u และ v ไม่เป็นเวกเตอร์ศูนย์\nu × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁)',
    9: 'ค่าเฉลี่ย: x̄ = (Σxᵢ)/n\nความแปรปรวนประชากร: σ² = Σ(xᵢ − μ)²/N\nส่วนเบี่ยงเบนมาตรฐานประชากร: σ = √σ²\nความแปรปรวนตัวอย่าง: s² = Σ(xᵢ − x̄)²/(n − 1) เมื่อ n > 1',
    10: 'd/dx (xⁿ) = nxⁿ⁻¹ สำหรับ n เป็นจำนวนเต็มบวก\nd/dx (ค่าคงตัว) = 0\nd/dx (uv) = u′v + uv′\n∫xⁿ dx = xⁿ⁺¹/(n + 1) + C สำหรับ n เป็นจำนวนเต็มไม่ลบ\n∫ₐᵇ f(x) dx = F(b) − F(a) เมื่อ F′ = f และ f ต่อเนื่องบน [a, b]',
  };

  const formulas = {
    m4: {
      basic: [
        { id: 1, title: "เซต (Sets)", description: "สับเซต, พาวเวอร์เซต, ยูเนียน, อินเตอร์เซกชัน", icon: BookOpen },
        { id: 2, title: "ตรรกศาสตร์ (Logic)", description: "ตารางค่าความจริง, ประพจน์ที่สมมูลกัน", icon: Variable },
      ],
      additional: [
        { id: 3, title: "เรขาคณิตวิเคราะห์", description: "ระยะทางระหว่างจุด, ความชัน, สมการเส้นตรง", icon: Calculator },
        { id: 4, title: "ภาคตัดกรวย", description: "วงกลม, วงรี, พาราโบลา, ไฮเพอร์โบลา", icon: Sigma },
      ]
    },
    m5: {
      basic: [
        { id: 5, title: "ลำดับและอนุกรม", description: "ลำดับเลขคณิต, ลำดับเรขาคณิต, อนุกรม", icon: Sigma },
      ],
      additional: [
        { id: 6, title: "ฟังก์ชันตรีโกณมิติ", description: "สูตรมุมสองเท่า, มุมครึ่งเท่า, กฎของไซน์และโคไซน์", icon: Activity },
        { id: 7, title: "เมทริกซ์ (Matrices)", description: "ดีเทอร์มิแนนต์, ไมเนอร์, โคแฟกเตอร์, อินเวอร์ส", icon: BookOpen },
        { id: 8, title: "เวกเตอร์", description: "ดอทโปรดักต์, ครอสโปรดักต์", icon: Calculator },
      ]
    },
    m6: {
      basic: [
        { id: 9, title: "สถิติเบื้องต้น", description: "ค่าเฉลี่ย, มัธยฐาน, ฐานนิยม, ส่วนเบี่ยงเบนมาตรฐาน", icon: Calculator },
      ],
      additional: [
        { id: 10, title: "แคลคูลัส (Calculus)", description: "ลิมิต, อนุพันธ์ของฟังก์ชัน, ปริพันธ์ (อินทิเกรต)", icon: Activity },
      ]
    }
  };

  const activeFormulas = formulas[activeGrade]?.[activeType] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">คลังสูตรคณิตศาสตร์</h1>
          <p className="text-textSecondary text-sm md:text-base">
            รวมสูตรและสรุปเนื้อหาสำคัญ แยกตามระดับชั้น
          </p>
        </div>
      </div>

      <TabSwitcher
        activeType={activeType}
        onTypeChange={setActiveType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeFormulas.map((formula) => (
          <Card key={formula.id} className="hover:shadow-card hover:-translate-y-1 transition-all border-t-4 border-t-success">
            <button className="w-full text-left" onClick={() => { setSelected(formula); dialog.current.showModal(); }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <formula.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-textPrimary mb-1">{formula.title}</h3>
                <p className="text-sm text-textSecondary line-clamp-2">{formula.description}</p>
                <div className="mt-4 flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  เปิดดูสูตร <span className="ml-1">→</span>
                </div>
              </div>
            </div>
            </button>
          </Card>
        ))}

        {activeFormulas.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            <Sigma className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>ยังไม่มีคลังสูตรในหมวดหมู่นี้</p>
          </div>
        )}
      </div>
      <dialog ref={dialog} aria-labelledby="formula-title">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-primary">คลังสูตรคณิตศาสตร์</p><h2 id="formula-title" className="mt-2 text-xl font-bold">{selected?.title}</h2></div><form method="dialog"><button aria-label="ปิดสูตร" className="p-2 rounded-full bg-gray-50"><X size={18} /></button></form></div>
          <p className="mt-5 rounded-xl bg-secondary/25 p-5 whitespace-pre-line text-sm leading-9">{notes[selected?.id]}</p>
          <Button className="mt-5" onClick={() => downloadMaterial({ title: selected.title, chapter: 'สรุปสูตรคณิตศาสตร์', content: notes[selected.id] })}><Download size={16} />ดาวน์โหลดสูตร (TXT)</Button>
        </div>
      </dialog>
    </div>
  );
}
