import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import { Dashboard, Courses, Classroom, Lesson, Assignments, Assignment, Worksheets, Scores, Profile, Password, Privacy } from './pages/StudentPages';
import Admin from './pages/Admin';
function Protected({ children, admin = false, password = false }) {
  const { ready, user } = useUser();
  if (!ready) return <p className="p-10 text-center">กำลังเปิดห้องเรียน…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChange && !password) return <Navigate to="/password" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
export default function App() {
  return <UserProvider><BrowserRouter><Routes>
    <Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/privacy" element={<Privacy />} />
    <Route path="/password" element={<Protected password><Password /></Protected>} />
    <Route element={<Protected><MainLayout /></Protected>}>
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/courses" element={<Courses />} />
      <Route path="/classrooms/:id" element={<Classroom />} /><Route path="/sessions/:id" element={<Lesson />} />
      <Route path="/assignments" element={<Assignments />} /><Route path="/assignments/:id" element={<Assignment />} />
      <Route path="/worksheets" element={<Worksheets />} /><Route path="/scores" element={<Scores />} /><Route path="/profile" element={<Profile />} />
      <Route path="/admin/:view?" element={<Protected admin><AdminPage /></Protected>} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter></UserProvider>;
}
function AdminPage() {
  const { view = 'dashboard' } = useParams();
  return <Admin key={view} />;
}
