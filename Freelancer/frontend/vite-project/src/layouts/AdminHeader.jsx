import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Đây là "Header" (Header) (Top Nav "trắng" (white)) "của" (for) "Admin" (Admin)
 * @param {object} props
 * @param {function} props.onToggleMobileSidebar - "Hàm" (Function) "để" (to) "Mở" (Open) "Sidebar" (Sidebar) "trên" (on) "Mobile" (Mobile)
 * @param {function} props.onToggleDesktopSidebar - "Hàm" (Function) "để" (to) "Thu nhỏ/Phóng to" (Collapse/Expand) "Sidebar" (Sidebar) "trên" (on) "Desktop" (Desktop)
 */
const AdminHeader = ({ onToggleMobileSidebar, onToggleDesktopSidebar }) => { // <-- "NÓ" (IT) "NHẬN" (RECEIVES) "2" (TWO) "HÀM" (FUNCTIONS)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const adminUser = {
    name: 'Admin JobConnect',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=ffffff&bold=true',
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b
                     bg-white px-4 shadow-sm">
      
      {/* 1. "Phía" (Side) "Bên Trái" (Left) (ĐÃ "NÂNG CẤP" (UPGRADED)) */}
      <div className="flex items-center">
        
        {/* Nút "Hamburger" (Hamburger) "CHO" (FOR) "DESKTOP" (DESKTOP) (MỚI) */}
        <button 
          onClick={onToggleDesktopSidebar} // <-- "Hàm" (Function) "MỚI" (NEW) "cho" (for) "Desktop" (Desktop)
          className="hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 lg:block" // <-- "Chỉ" (Only) "hiện" (show) "trên" (on) "DESKTOP" (DESKTOP)
        >
          <Menu size={24} />
        </button>

        {/* Nút "Hamburger" (Hamburger) "CHO" (FOR) "MOBILE" (MOBILE) (CŨ) */}
        <button 
          onClick={onToggleMobileSidebar} // <-- "Hàm" (Function) "CŨ" (OLD) "giờ" (now) "cho" (for) "Mobile" (Mobile)
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 lg:hidden" // <-- "Chỉ" (Only) "hiện" (show) "trên" (on) "MOBILE" (MOBILE)
        >
          <Menu size={24} />
        </button>
        
        {/* "Links" (Links) (Home, Contact) (Giữ "nguyên" (same)) */}
        <nav className="hidden items-center space-x-2 lg:flex">
          <Link to="/admin/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Home (Admin)
          </Link>
          <Link to="/admin/support" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Hỗ trợ (Admin)
          </Link>
        </nav>
      </div>

      {/* 2. "Phía" (Side) "Bên Phải" (Right) (Giữ "nguyên" (same)) */}
      <div className="flex items-center space-x-3">
        {/* Nút "Search" (Search) */}
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Search size={20} />
        </button>
        
        {/* Nút "Thông báo" (Notify) */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
        </button>

        {/* "Dropdown" (Dropdown) "User" (User) */}
        <div className="relative">
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-100"
          >
            <img
              src={adminUser.avatar}
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="hidden font-semibold text-gray-700 md:block">{adminUser.name}</span>
          </motion.button>

          {/* "Menu" (Menu) "xổ xuống" (dropdown) */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                onMouseLeave={() => setIsDropdownOpen(false)} 
              >
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User size={16} /> Trang User
                </Link>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut size={16} /> Đăng xuất
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;