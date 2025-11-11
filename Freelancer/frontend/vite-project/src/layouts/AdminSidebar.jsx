import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  LifeBuoy, 
  DollarSign, 
  Cog,
  BarChart,
  FileCheck,
  FileSearch,
  X
} from 'lucide-react';

// "Data" (Data) "giả" (mock) "cho" (for) "Admin" (Admin) (Giữ "nguyên" (same))
const adminUser = {
  name: 'Admin JobConnect',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=ffffff&bold=true',
};

// --- "Linh kiện" (Component) "con" (child) (ĐÃ "NÂNG CẤP" (UPGRADED)) ---
// "Nó" (It) "nhận" (receives) "thêm" (one more) "prop" (prop) `isCollapsed`
const AdminSidebarLink = ({ to, icon, label, isCollapsed }) => (
  <NavLink
    to={to}
    end 
    className={({ isActive }) =>
      `flex items-center space-x-3 rounded-lg px-3 py-2.5 
       transition-colors duration-200
       ${
         isActive
           ? 'bg-blue-600 text-white shadow-lg' // Style "Active" (Active)
           : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Style "Thường" (Normal)
       }
       ${isCollapsed ? 'justify-center' : ''}` // "Căn" (Center) "giữa" (center) "icon" (icon) "khi" (when) "thu nhỏ" (collapsed)
    }
  >
    {icon}
    {/* "CHỖ" (PLACE) "NÀY" (THIS) "THÔNG MINH" (IS SMART): "Tự" (Auto) "ẩn" (hide) "chữ" (text) "khi" (when) "thu nhỏ" (collapsed) */}
    <span className={`font-medium text-sm ${isCollapsed ? 'hidden' : 'block'}`}>
      {label}
    </span>
  </NavLink>
);
// --------------------------------

/**
 * Đây là "Sidebar" (Sidebar) (Left Nav "tối" (dark)) "của" (for) "Admin" (Admin)
 * @param {object} props
 * @param {boolean} props.isMobileOpen - "State" (State) "cho" (for) "Mobile" (Mobile)
 * @param {boolean} props.isDesktopCollapsed - "State" (State) "CHO" (FOR) "DESKTOP" (DESKTOP) (MỚI)
 * @param {function} props.onCloseSidebar - "Hàm" (Function) "đóng" (close) "cho" (for) "Mobile" (Mobile)
 */
const AdminSidebar = ({ isMobileOpen, isDesktopCollapsed, onCloseSidebar }) => {
  return (
    <>
      {/* "Lớp" (Layer) "phủ" (overlay) "mờ" (dim) "cho" (for) "Mobile" (Mobile) (Giữ "nguyên" (same)) */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden 
                    ${isMobileOpen ? 'block' : 'hidden'}`}
        onClick={onCloseSidebar} 
      ></div>

      {/* "CÁI" (THE) "SIDEBAR" (SIDEBAR) "THẬT" (REAL) (ĐÃ "NÂNG CẤP" (UPGRADED) "LOGIC" (LOGIC) "CHIỀU RỘNG" (WIDTH)) */}
      <aside 
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col 
                    bg-gray-800 text-white shadow-lg
                    transition-all duration-300 ease-in-out // "Dùng" (Use) "transition-all" (transition-all) "cho" (for) "nó" (it) "mượt" (smooth)
                    
                    // "Logic" (Logic) "chiều rộng" (width) "CHO" (FOR) "DESKTOP" (DESKTOP) (MỚI)
                    lg:sticky
                    ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'} 

                    // "Logic" (Logic) "trượt" (slide) "CHO" (FOR) "MOBILE" (MOBILE) (CŨ)
                    lg:translate-x-0
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          
          {/* 1. Logo/Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
            {/* "Tự" (Auto) "ẩn" (hide) "chữ" (text) "khi" (when) "thu nhỏ" (collapsed) */}
            <Link to="/admin/dashboard" className={`text-2xl font-bold text-white ${isDesktopCollapsed ? 'hidden' : 'block'}`}>
              Job<span className="text-blue-400">Connect</span>
            </Link>
            {/* "Hiện" (Show) "logo" (logo) "bé" (small) "khi" (when) "thu nhỏ" (collapsed) */}
            <Link to="/admin/dashboard" className={`text-3xl font-bold text-white ${isDesktopCollapsed ? 'block' : 'hidden'}`}>
              J<span className="text-blue-400">C</span>
            </Link>
            
            <button onClick={onCloseSidebar} className="text-gray-400 hover:text-white lg:hidden">
              <X size={24} />
            </button>
          </div>

          {/* 2. "Avatar" (Avatar) "Admin" (Admin) (ĐÃ "NÂNG CẤP" (UPGRADED)) */}
          <div className={`flex items-center space-x-3 border-b border-gray-700 p-4 ${isDesktopCollapsed ? 'justify-center' : ''}`}>
            <img 
              src={adminUser.avatar} 
              alt="Admin Avatar" 
              className={`h-10 w-10 rounded-full border-2 border-red-500 ${isDesktopCollapsed ? 'flex-shrink-0' : ''}`} 
            />
            {/* "Tự" (Auto) "ẩn" (hide) "chữ" (text) "khi" (when) "thu nhỏ" (collapsed) */}
            <div className={`${isDesktopCollapsed ? 'hidden' : 'block'}`}>
              <p className="font-semibold text-white">{adminUser.name}</p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>

          {/* 3. "Menu" (Menu) "chính" (main) (ĐÃ "NÂNG CẤP" (UPGRADED)) */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            
            {/* Nhóm 1: Quản lý "Chính" (Main) */}
            <p className={`text-xs font-semibold uppercase text-gray-400 ${isDesktopCollapsed ? 'text-center' : ''}`}>
              {isDesktopCollapsed ? 'QL' : 'Quản lý'}
            </p>
            <AdminSidebarLink
              to="/admin/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Tổng quan"
              isCollapsed={isDesktopCollapsed} // "Truyền" (Pass) "state" (state) "thu nhỏ" (collapsed) "xuống" (down)
            />
            <AdminSidebarLink
              to="/admin/users" 
              icon={<Users size={18} />}
              label="Quản lý User"
              isCollapsed={isDesktopCollapsed}
            />
            
            {/* Nhóm 2: "Kiểm duyệt" (Moderation) */}
            <p className={`mt-4 text-xs font-semibold uppercase text-gray-400 ${isDesktopCollapsed ? 'text-center' : ''}`}>
              {isDesktopCollapsed ? 'KD' : 'Kiểm duyệt'}
            </p>
            <AdminSidebarLink
              to="/admin/moderate-employers"
              icon={<FileCheck size={18} />}
              label="Duyệt Employer"
              isCollapsed={isDesktopCollapsed}
            />
            <AdminSidebarLink
              to="/admin/moderate-jobs"
              icon={<FileSearch size={18} />}
              label="Duyệt Job Đăng"
              isCollapsed={isDesktopCollapsed}
            />
            <AdminSidebarLink
              to="/admin/moderate-posts"
              icon={<ShieldCheck size={18} />}
              label="Duyệt Bài Post"
              isCollapsed={isDesktopCollapsed}
            />

            {/* Nhóm 3: "Vận hành" (Operations) */}
            <p className={`mt-4 text-xs font-semibold uppercase text-gray-400 ${isDesktopCollapsed ? 'text-center' : ''}`}>
              {isDesktopCollapsed ? 'VH' : 'Vận hành'}
            </p>
            <AdminSidebarLink
              to="/admin/support" 
              icon={<LifeBuoy size={18} />}
              label="Quản lý Hỗ trợ"
              isCollapsed={isDesktopCollapsed}
            />
            <AdminSidebarLink
              to="/admin/payments" 
              icon={<DollarSign size={18} />}
              label="Lịch sử Giao dịch"
              isCollapsed={isDesktopCollapsed}
            />
            <AdminSidebarLink
              to="/admin/analytics" 
              icon={<BarChart size={18} />}
              label="Thống kê Doanh thu"
              isCollapsed={isDesktopCollapsed}
            />
            <AdminSidebarLink
              to="/admin/system" 
              icon={<Cog size={18} />}
              label="Quản lý Hệ thống"
              isCollapsed={isDesktopCollapsed}
            />
          </nav>
          
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;