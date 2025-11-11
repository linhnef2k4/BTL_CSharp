import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
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

// Dữ liệu "giả" cho header
const employerUser = {
  name: 'FPT Software', // Tên công ty (hoặc HR)
  avatar: 'https://placehold.co/40x40/f03c2e/ffffff?text=F', // Logo
};

// --- Component con cho "sạch" ---
// Nó "thông minh" biết "active" (nền xanh)
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end // 'end' rất quan trọng cho "Tổng quan"
    className={({ isActive }) =>
      `flex items-center space-x-3 rounded-lg px-3 py-2.5 
       transition-colors duration-200
       ${
         isActive
           ? 'bg-blue-600 text-white shadow-lg' // Style "Active"
           : 'text-gray-600 hover:bg-gray-100' // Style "Thường"
       }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);
// --------------------------------

const EmployerLayout = () => {
  return (
    // Layout 2 cột "full" màn hình
    <div className="flex h-screen bg-gray-100">
      
      {/* === 1. SIDEBAR (BÊN TRÁI) "Xịn" === */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          
          {/* Logo/Header (trỏ về trang chủ) */}
          <div className="flex h-16 items-center justify-center border-b">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Job<span className="text-gray-800">Connect</span>
            </Link>
          </div>

          {/* Menu chính (cuộn được) */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {/* 7 nút "xịn" (y như ta "bàn") */}
            <SidebarLink
              to="/employer/dashboard" // (Trỏ đến File 2/3)
              icon={<LayoutDashboard size={20} />}
              label="Tổng quan"
            />
            <SidebarLink
              to="/employer/post-job" // (Trỏ đến File 2/3)
              icon={<FilePlus size={20} />}
              label="Đăng Job Mới"
            />
            <SidebarLink
              to="/employer/manage-jobs" // (TrT
              icon={<ClipboardList size={20} />}
              label="Quản lý Job"
            />
            <SidebarLink
              to="/employer/find-candidates" // (Trỏ đến File 2/3)
              icon={<Search size={20} />}
              label="Tìm Ứng Viên"
            />
            <SidebarLink
              to="/employer/messages" // (Trỏ đến File 2/3)
              icon={<MessageSquare size={20} />}
              label="Tin Nhắn"
            />
            <SidebarLink
              to="/employer/vip-package" // (Trỏ đến File 2/3)
              icon={<Star size={20} />}
              label="Gói VIP"
            />
            <SidebarLink
              to="/employer/support" // (Trỏ đến File 2/3)
              icon={<LifeBuoy size={20} />}
              label="Hỗ trợ"
            />
          </nav>

          {/* Footer (User/Settings) */}
          <div className="border-t p-4">
            <SidebarLink
              to="/employer/settings" // (Trỏ đến File 2/3)
              icon={<Settings size={20} />}
              label="Cài đặt"
            />
            {/* Giả lập 1 "link" Đăng xuất */}
            <div className="mt-2">
               <SidebarLink
                to="/" // Tạm thời trỏ về trang chủ
                icon={<LogOut size={20} className="text-red-500" />}
                label="Đăng xuất"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* === 2. KHUNG CHÍNH (BÊN PHẢI) === */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Header (chứa avatar user "xịn") */}
         <header className="sticky top-0 z-10 flex h-16 items-center justify-end bg-white px-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="hidden text-sm font-semibold sm:block">{employerUser.name}</span>
              <img src={employerUser.avatar} alt="Avatar" className="h-9 w-9 rounded-full border"/>
            </div>
         </header>

         {/* Nội dung (các trang con sẽ load ở đây) */}
         <div className="p-6">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default EmployerLayout;