import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Search,
  MessageSquare,
  Star,
  LifeBuoy,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth Context

// --- Component con cho "sạch" ---
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center space-x-3 rounded-lg px-3 py-2.5 
       transition-colors duration-200
       ${
         isActive
           ? 'bg-blue-600 text-white shadow-lg'
           : 'text-gray-600 hover:bg-gray-100'
       }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const EmployerLayout = () => {
  const { user, logout } = useAuth(); // 2. Lấy thông tin User & hàm Logout
  const navigate = useNavigate();

  // 3. Xử lý Đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login'); // Chuyển về trang login sau khi đăng xuất
  };

  // 4. Helper lấy thông tin hiển thị
  const getDisplayName = () => {
      if (!user) return 'Employer';
      // Ưu tiên tên công ty, nếu không có thì lấy tên cá nhân
      return user.employer?.companyName || user.fullName || "Nhà tuyển dụng";
  };

  const getAvatarUrl = () => {
      if (!user) return 'https://ui-avatars.com/api/?name=E&background=random';
      
      // Ưu tiên Logo công ty -> Avatar Seeker (nếu có) -> Tạo avatar từ tên
      const logo = user.employer?.logoCompany || user.employer?.companyLogoUrl;
      if (logo) return logo;

      const name = getDisplayName().replace(/\s/g, '+');
      return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* === 1. SIDEBAR (BÊN TRÁI) === */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col z-20">
        
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-1 hover:opacity-80 transition">
             Job<span className="text-gray-800">Connect</span> <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-1">HR</span>
          </Link>
        </div>

        {/* Menu chính */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 custom-scrollbar">
          <SidebarLink to="/employer/dashboard" icon={<LayoutDashboard size={20} />} label="Tổng quan" />
          <SidebarLink to="/employer/post-job" icon={<FilePlus size={20} />} label="Đăng Job Mới" />
          <SidebarLink to="/employer/manage-jobs" icon={<ClipboardList size={20} />} label="Quản lý Job" />
          <SidebarLink to="/employer/find-candidates" icon={<Search size={20} />} label="Tìm Ứng Viên" />
          <SidebarLink to="/employer/messages" icon={<MessageSquare size={20} />} label="Tin Nhắn" />
          <SidebarLink to="/employer/vip-package" icon={<Star size={20} />} label="Gói VIP" />
          <SidebarLink to="/employer/support" icon={<LifeBuoy size={20} />} label="Hỗ trợ" />
        </nav>

        {/* Footer (Settings & Logout) */}
        <div className="border-t p-4 space-y-1.5 bg-gray-50">
          <SidebarLink to="/employer/settings" icon={<Settings size={20} />} label="Cài đặt" />
          
          {/* Nút Đăng xuất (Dùng button thay vì NavLink) */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* === 2. KHUNG CHÍNH (BÊN PHẢI) === */}
      <main className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-end bg-white px-6 shadow-sm z-10 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-gray-800">{getDisplayName()}</p>
                 <p className="text-xs text-gray-500">Nhà tuyển dụng</p>
              </div>
              <img 
                src={getAvatarUrl()} 
                alt="Avatar" 
                className="h-10 w-10 rounded-full border border-gray-200 object-contain bg-gray-50 p-0.5"
              />
            </div>
        </header>

        {/* Nội dung trang con */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
           <div className="max-w-7xl mx-auto">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerLayout;