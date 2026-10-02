import React from "react";

export const topicContents = {
  "m4-b-1-t1": (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <h3 className="text-xl font-bold text-blue-800 border-b pb-2">1. ความหมายและลักษณะของเซต</h3>
      <p>
        ในทางคณิตศาสตร์ <strong>"เซต" (Set)</strong> เป็นคำอนิยามที่ใช้แทนกลุ่ม หมวดหมู่ หรือหมู่ของสิ่งต่างๆ โดยที่เราสามารถระบุได้อย่างชัดเจน (Well-defined) ว่าสิ่งใดอยู่ในกลุ่มและสิ่งใดไม่อยู่ในกลุ่ม
      </p>

      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 my-6">
        <h4 className="font-bold text-blue-900 mb-2">ตัวอย่างของการเป็น "เซต"</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>เซตของสระในภาษาอังกฤษ <em>(ระบุได้ชัดเจนว่าเป็น a, e, i, o, u)</em></li>
          <li>เซตของจำนวนเต็มบวกที่น้อยกว่า 5 <em>(ระบุได้ชัดเจนว่าเป็น 1, 2, 3, 4)</em></li>
          <li>เซตของจังหวัดในประเทศไทยที่มีชื่อขึ้นต้นด้วย "ก"</li>
        </ul>

        <h4 className="font-bold text-red-700 mt-4 mb-2">ตัวอย่างที่ "ไม่เป็นเซต" (เพราะไม่สามารถระบุได้ชัดเจน)</h4>
        <ul className="list-disc pl-5 space-y-1 text-red-900/80">
          <li>กลุ่มของคนหล่อ <em>(มาตรฐานความหล่อของแต่ละคนไม่เท่ากัน)</em></li>
          <li>กลุ่มของผลไม้ที่อร่อย <em>(ความอร่อยเป็นเรื่องส่วนบุคคล)</em></li>
        </ul>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mt-6">2. สมาชิกของเซต (Elements)</h3>
      <p>สิ่งต่างๆ ที่อยู่ในเซต เราจะเรียกว่า <strong>"สมาชิก"</strong> โดยใช้สัญลักษณ์แทนดังนี้:</p>
      <div className="bg-gray-50 p-4 rounded-lg my-4 flex flex-col gap-2 font-mono text-sm">
        <p><span className="text-blue-600 font-bold text-lg mr-2">∈</span> แทนคำว่า "เป็นสมาชิกของ"</p>
        <p><span className="text-red-600 font-bold text-lg mr-2">∉</span> แทนคำว่า "ไม่เป็นสมาชิกของ"</p>
      </div>

      <p><strong>ตัวอย่าง:</strong> กำหนดให้ A = {"{1, 2, 3, 4}"}</p>
      <ul className="list-disc pl-5">
        <li>1 ∈ A (1 เป็นสมาชิกของ A)</li>
        <li>5 ∉ A (5 ไม่เป็นสมาชิกของ A)</li>
      </ul>
    </div>
  ),

  "m4-b-1-t2": (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <h3 className="text-xl font-bold text-blue-800 border-b pb-2">การเขียนเซต (Set Notation)</h3>
      <p>การเขียนเซตสามารถทำได้ 2 รูปแบบหลักๆ คือ:</p>

      <div className="space-y-6 mt-4">
        <div>
          <h4 className="font-bold text-lg text-gray-800">1. การเขียนเซตแบบแจกแจงสมาชิก (Tabular Form)</h4>
          <p className="mt-2">
            เขียนสมาชิกทุกตัวลงในวงเล็บปีกกา <code>{"{ }"}</code> และคั่นสมาชิกแต่ละตัวด้วยเครื่องหมายจุลภาค <code>,</code>
            (หากมีสมาชิกซ้ำกัน จะนับเป็นเพียงตัวเดียว)
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-3 font-mono text-sm">
            <p>A = {"{a, e, i, o, u}"}</p>
            <p>B = {"{1, 3, 5, 7, 9}"}</p>
            <p className="text-gray-500 mt-2">กรณีสมาชิกเยอะมากและมีรูปแบบชัดเจน สามารถใช้จุด 3 จุด (...) เช่น C = {"{1, 2, 3, ..., 100}"}</p>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg text-gray-800">2. การเขียนเซตแบบบอกเงื่อนไข (Builder Form)</h4>
          <p className="mt-2">
            ใช้วงเล็บปีกกาเช่นเดียวกัน แต่จะกำหนดตัวแปรแทนสมาชิก และมีเครื่องหมายขีดขวาง <code>|</code> หรือโคลอน <code>:</code> ซึ่งอ่านว่า "โดยที่"
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mt-3 border border-blue-100">
            <p className="font-mono font-bold text-blue-900">D = {"{ x | x เป็นจำนวนเต็มบวกที่น้อยกว่า 5 }"}</p>
            <p className="text-sm mt-2 text-blue-800">อ่านว่า: D เป็นเซตของ x โดยที่ x เป็นจำนวนเต็มบวกที่น้อยกว่า 5</p>
          </div>
        </div>
      </div>
    </div>
  ),

  "m4-b-1-t3": (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <h3 className="text-xl font-bold text-blue-800 border-b pb-2">ชนิดของเซต</h3>
      <p>เราสามารถแบ่งชนิดของเซตตามจำนวนสมาชิกได้ดังนี้</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h4 className="font-bold text-green-700 text-lg mb-2">1. เซตจำกัด (Finite Set)</h4>
          <p className="text-sm">เซตที่สามารถนับจำนวนสมาชิกได้ว่ามีกี่ตัว (แม้จะเยอะมากก็ตาม)</p>
          <div className="mt-3 bg-gray-50 p-3 rounded text-sm font-mono">
            A = {"{1, 2, 3}"} (มี 3 ตัว)<br />
            B = {"{1, 2, 3, ..., 1000}"} (มี 1000 ตัว)
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h4 className="font-bold text-purple-700 text-lg mb-2">2. เซตอนันต์ (Infinite Set)</h4>
          <p className="text-sm">เซตที่ไม่สามารถนับจำนวนสมาชิกได้ครบถ้วน (มีเยอะมากไปเรื่อยๆ ไม่มีที่สิ้นสุด)</p>
          <div className="mt-3 bg-gray-50 p-3 rounded text-sm font-mono">
            C = {"{1, 2, 3, ...}"}<br />
            D = {"{ x | x เป็นจำนวนจริง }"}
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl shadow-sm mt-4">
        <h4 className="font-bold text-orange-700 text-lg mb-2">3. เซตว่าง (Empty Set)</h4>
        <p className="text-sm mb-2">
          เซตที่ไม่มีสมาชิกเลย (ถือเป็นเซตจำกัดชนิดหนึ่งที่มีสมาชิก 0 ตัว)
          ใช้สัญลักษณ์ <strong>∅</strong> หรือ <strong>{"{ }"}</strong>
        </p>
        <div className="bg-white/50 p-3 rounded text-sm font-mono text-orange-900">
          E = {"{ x | x เป็นจำนวนเต็มบวกที่น้อยกว่า 0 }"} = ∅<br />
          (เพราะไม่มีจำนวนเต็มบวกใดน้อยกว่าศูนย์)
        </div>
      </div>
    </div>
  )
};
