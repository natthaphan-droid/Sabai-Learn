import { Outlet, NavLink } from "react-router-dom";
import { Home, BookOpen, ClipboardList, FileText, BarChart2, User, Bell } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "วิชาของฉัน" },
  { to: "/assignments", icon: ClipboardList, label: "งานที่ได้รับ" },
  { to: "/worksheets", icon: FileText, label: "เอกสาร" },
  { to: "/scores", icon: BarChart2, label: "คะแนน" },
  { to: "/profile", icon: User, label: "โปรไฟล์" },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[260px] fixed inset-y-0 left-0 bg-surface border-r border-gray-100 z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-gray-50/50">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-soft">S</div>
          <span className="font-bold text-xl text-primary">Sabai Learn</span>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-primary text-white shadow-soft" 
                    : "text-textSecondary hover:bg-primary/5 hover:text-primary"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] pb-24 md:pb-0 flex flex-col min-h-screen relative">
        {/* Topbar */}
        <header className="h-[72px] bg-surface/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold hidden md:block text-textPrimary"></h1>
          <div className="md:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-bold text-lg text-primary">Sabai Learn</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-11 h-11 rounded-full bg-background flex items-center justify-center text-textSecondary hover:bg-gray-100 transition-colors relative border border-gray-100 shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface"></span>
            </button>
            <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-background border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-9 h-9 rounded-full object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-textPrimary leading-tight">น้องนนท์ 👋</p>
                <p className="text-xs text-textSecondary">ม.4/1</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 flex justify-around px-2 py-2 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-[20%] py-2 rounded-xl transition-all",
                isActive ? "text-primary" : "text-textSecondary"
              )
            }
          >
            <div className={cn("p-1.5 rounded-full mb-1 transition-colors", isActive ? "bg-primary/10" : "")}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
