import { Routes, Route, Navigate } from 'react-router-dom';

// --- LUỒNG 1 & 2 (SEEKER & AUTH) ---
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx'; 
import Home from './pages/core/Home.jsx';
import Login from './pages/auth/Login.jsx'; 
import Register from './pages/auth/Register.jsx'; 
import ForgotPassword from './pages/auth/ForgotPassword.jsx'; 
import JobListings from './components/jobs/JobListings.jsx';
import JobDetail from './components/jobs/JobDetail.jsx';
import MessagesPage from './pages/messages/MessagesPage.jsx';
import VipPackage from './pages/core/VipPackage.jsx';
import CVBuilder from './pages/cv/CVBuilder.jsx';
// <<< 1. IMPORT COMPONENT THẬT TỪ BƯỚC 6
import Profile from './pages/core/Profile.jsx'; 
// const Profile = () => <...>; // (Xóa dòng placeholder này nếu có)
const ChangePassword = () => <div className="p-8 text-4xl">Trang Đổi Mật Khẩu</div>;

// --- CÁC LUỒNG KHÁC (giữ nguyên) ---
import EmployerLayout from './layouts/EmployerLayout.jsx';
import EmployerRegister from './pages/employer/EmployerRegister.jsx'; 
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';
import PostJob from './pages/employer/PostJob.jsx';
import ManageJobs from './pages/employer/ManageJobs.jsx';
import FindCandidates from './pages/employer/FindCandidates.jsx';
import EmployerMessagesPage from './pages/employer/EmployerMessagesPage.jsx';
import EmployerVipPage from './pages/employer/EmployerVipPage.jsx';
import SupportPage from './pages/employer/SupportPage.jsx';
import SettingsPage from './pages/employer/SettingsPage.jsx';

import AdminLayout from './layouts/AdminLayout.jsx'; 
import AdminDashboard from './pages/admin/AdminDashboard.jsx'; 
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminModerateEmployersPage from './pages/admin/AdminModerateEmployersPage.jsx';
import AdminModerateJobsPage from './pages/admin/AdminModerateJobsPage.jsx';
import AdminModeratePostsPage from './pages/admin/AdminModeratePostsPage.jsx';
import AdminSupportPage from './pages/admin/AdminSupportPage.jsx';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx';
import AdminSystemPage from './pages/admin/AdminSystemPage.jsx';

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
        
        {/* <<< 2. ĐÃ CẬP NHẬT ROUTE NÀY (giữ nguyên) >>> */}
        {/* Route này giờ sẽ render component thật từ Bước 6 */}
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
        <Route path="payments" element={<AdminPaymentsPage />} /> 
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
      </Route>

    </Routes>
  );
}
export default App;