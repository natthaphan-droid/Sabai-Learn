import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, Paperclip, UploadCloud, File, X, CheckCircle } from "lucide-react";

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock assignment data based on ID
  const assignment = {
    title: "แบบฝึกหัดสมการเชิงเส้น",
    course: "คณิตศาสตร์เพิ่มเติม",
    teacher: "ครูสมคิด รักเรียน",
    deadline: "14 ก.ย. 2026 เวลา 23:59 น.",
    maxScore: 20,
    status: isSubmitted ? "submitted" : "pending",
    description: "ให้นักเรียนทำแบบฝึกหัดเรื่องสมการเชิงเส้นตัวแปรเดียว จำนวน 10 ข้อ โดยแสดงวิธีทำอย่างละเอียด สามารถเขียนลงกระดาษแล้วถ่ายรูป หรือทำในแท็บเล็ตแล้วเซฟเป็น PDF ส่งได้ครับ",
    attachments: [
      { name: "แบบฝึกหัด_บทที่3.pdf", size: "2.4 MB" }
    ]
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setShowModal(false);
    setIsSubmitted(true);
    setFiles([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-primary">{assignment.course}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-textSecondary">{assignment.teacher}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mb-3">{assignment.title}</h1>
          <div className="flex items-center gap-3">
            {assignment.status === "pending" ? <Badge variant="warning">รอส่ง</Badge> : <Badge variant="success">ส่งแล้ว</Badge>}
            <span className="text-sm text-textSecondary font-medium">คะแนนเต็ม: {assignment.maxScore}</span>
          </div>
        </div>
        
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 flex flex-col items-end shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider mb-1">กำหนดส่ง</span>
          <span className="font-bold">{assignment.deadline}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Details & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-3 mb-4">รายละเอียดงาน</h3>
            <p className="text-textPrimary leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {assignment.description}
            </p>
            
            {assignment.attachments.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-textSecondary mb-3">ไฟล์แนบจากครู ({assignment.attachments.length})</h4>
                <div className="space-y-2">
                  {assignment.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">{file.name}</p>
                        <p className="text-xs text-textSecondary">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Submission Area */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <h3 className="font-bold text-lg mb-4">ส่งงานของคุณ</h3>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="font-bold text-lg text-textPrimary mb-1">ส่งงานเรียบร้อยแล้ว</h4>
                <p className="text-sm text-textSecondary mb-6">วันที่ส่ง: 13 ก.ย. 2026, 11:45 น.</p>
                <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>ยกเลิกการส่ง (เพื่อส่งใหม่)</Button>
              </div>
            ) : (
              <>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    dragActive ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="text-sm font-bold text-textPrimary mb-1">ลากไฟล์มาวางที่นี่</p>
                  <p className="text-xs text-textSecondary mb-4">รองรับ PDF, Word, Image (สูงสุด 10MB)</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                  />
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current.click()}>
                    หรือเลือกไฟล์
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <File className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-xs font-medium truncate">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className="w-full mt-6" 
                  disabled={files.length === 0}
                  onClick={() => setShowModal(true)}
                >
                  ส่งงาน
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-center mb-2">ยืนยันการส่งงาน?</h3>
            <p className="text-center text-sm text-textSecondary mb-6">คุณได้แนบไฟล์ทั้งหมด {files.length} ไฟล์ ตรวจสอบความถูกต้องก่อนส่ง</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 bg-gray-100 hover:bg-gray-200" onClick={() => setShowModal(false)}>ยกเลิก</Button>
              <Button className="flex-1" onClick={handleSubmit}>ยืนยันส่งงาน</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
