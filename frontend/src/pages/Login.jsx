import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl mb-6 mx-auto md:mx-0 shadow-soft">S</div>
            <h1 className="text-3xl font-bold text-textPrimary">Sabai Learn</h1>
            <p className="text-textSecondary mt-2">เข้าสู่ระบบเพื่อเรียนออนไลน์</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-textPrimary">รหัสนักเรียน / อีเมล</label>
              <Input placeholder="ระบุรหัสนักเรียนหรืออีเมล" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-textPrimary">รหัสผ่าน</label>
              <Input type="password" placeholder="ระบุรหัสผ่าน" />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary font-medium hover:underline">ลืมรหัสผ่าน?</a>
            </div>

            <Button type="submit" className="w-full text-base py-3">เข้าสู่ระบบ</Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">หรือ</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button variant="google" type="button" className="w-full py-3">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              เข้าสู่ระบบด้วย Google
            </Button>
          </form>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex w-1/2 bg-softblue/10 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-md text-center z-10">
          <div className="bg-white p-8 rounded-3xl shadow-card mb-10 aspect-square max-h-[400px] flex items-center justify-center relative">
            <img src="https://illustrations.popsy.co/amber/student-going-to-school.svg" alt="Education" className="w-full h-full object-contain scale-110" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary mb-3">เรียนรู้ได้ทุกที่ ทุกเวลา</h2>
          <p className="text-textSecondary leading-relaxed">แพลตฟอร์มที่ออกแบบมาเพื่อให้นักเรียนและคุณครูเชื่อมต่อกันได้อย่างง่ายดาย สนุกกับการเรียนมากยิ่งขึ้น</p>
        </div>
      </div>
    </div>
  );
}
