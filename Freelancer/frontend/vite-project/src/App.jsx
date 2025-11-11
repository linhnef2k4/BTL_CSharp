import { Routes, Route, Navigate } from 'react-router-dom';

// --- LUỒNG 1 & 2 (SEEKER & AUTH) ---
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout'; 
import Home from './pages/core/Home';
import Login from './pages/auth/Login'; 
import Register from './pages/auth/Register'; 
import ForgotPassword from './pages/auth/ForgotPassword'; 
import JobListings from './components/jobs/JobListings';
import JobDetail from './components/jobs/JobDetail';
import MessagesPage from './pages/messages/MessagesPage';
import VipPackage from './pages/core/VipPackage';
import CVBuilder from './pages/cv/CVBuilder';
const Profile = () => <div className="p-8 text-4xl">Trang Thông tin cá nhân</div>;
const ChangePassword = () => <div className="p-8 text-4xl">Trang Đổi Mật Khẩu</div>;

// --- LUỒNG 3 & 4 (EMPLOYER) ---
import EmployerLayout from './layouts/EmployerLayout';
import EmployerRegister from './pages/employer/EmployerRegister'; 
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import FindCandidates from './pages/employer/FindCandidates';
import EmployerMessagesPage from './pages/employer/EmployerMessagesPage';
import EmployerVipPage from './pages/employer/EmployerVipPage';
import SupportPage from './pages/employer/SupportPage';
import SettingsPage from './pages/employer/SettingsPage';

// --- "LUỒNG" (FLOW) "5" (FIFTH): "ADMIN" (ADMIN) ---
import AdminLayout from './layouts/AdminLayout'; 
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminModerateEmployersPage from './pages/admin/AdminModerateEmployersPage';
import AdminModerateJobsPage from './pages/admin/AdminModerateJobsPage';
import AdminModeratePostsPage from './pages/admin/AdminModeratePostsPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
// --- "HÀNG XỊN" (REAL) MỚI ĐÃ ĐƯỢC IMPORT ---
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'; // <-- 1. IMPORT HÀNG "XỊN"
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSystemPage from './pages/admin/AdminSystemPage';
function App() {
  return (
    <Routes>
      
      {/* === LUỒNG 1: SEEKER (Dùng MainLayout) === */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/messages" element={<MessagesPage />} /> 
        <Route path="/cv-builder" element={<CVBuilder />} />
        <Route path="/vip-package" element={<VipPackage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* === LUỒNG 2: AUTH (Dùng AuthLayout) === */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* === LUỒNG 3: EMPLOYER (Dùng EmployerLayout) === */}
      <Route path="/employer" element={<EmployerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployerDashboard />} /> 
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="find-candidates" element={<FindCandidates />} />
        <Route path="messages" element={<EmployerMessagesPage />} /> 
        <Route path="vip-package" element={<EmployerVipPage />} /> 
        <Route path="support" element={<SupportPage />} /> 
        <Route path="settings" element={<SettingsPage />} /> 
      </Route>

      {/* === LUỒNG 4: EMPLOYER (CÔNG KHAI) === */}
      <Route path="/employer/register" element={<EmployerRegister />} />

      {/* === LUỒNG 5: "ADMIN" (ADMIN) (Dùng AdminLayout) === */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} /> 
        <Route path="users" element={<AdminUsersPage />} /> 
        <Route path="moderate-employers" element={<AdminModerateEmployersPage />} /> 
        <Route path="moderate-jobs" element={<AdminModerateJobsPage />} /> 
        <Route path="moderate-posts" element={<AdminModeratePostsPage />} /> 
        <Route path="support" element={<AdminSupportPage />} /> 
        
        {/* 3. CHỖ NÀY (THIS) "GIỜ" (NOW) "ĐÃ" (IS) "LÀ" (USING) "HÀNG" (THE) "XỊN" (REAL) "100%" */}
        <Route path="payments" element={<AdminPaymentsPage />} /> 
        
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
      </Route>

    </Routes>
  );
}
export default App;