import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Star, 
  Bell, 
  Search, 
  LogIn, 
  UserPlus,
  Settings,
  LogOut,
  ChevronDown,
  Lock
} from 'lucide-react';

// --- Dữ liệu giả để test ---
const isAuthenticated = true;
const user = { 
  name: 'Hồng Trâm', 
  avatar: 'https://ui-avatars.com/api/?name=Hong+Tram&background=random',
  role: 'Seeker'
};

// --- Component NavItem ---
const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex h-full w-28 flex-col items-center justify-center
         border-b-4 pt-1 transition-all duration-300 ${
          isActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-blue-600'
        }`
      }
    >
      <motion.div
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex flex-col items-center justify-center px-3 py-1"
      >
        {/* Nền hover mờ nhẹ phía sau icon */}
        <span className="absolute inset-0 rounded-full bg-blue-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <div className="z-10">{icon}</div>
        <span className="text-xs font-medium mt-1 z-10">{label}</span>
      </motion.div>
    </NavLink>
  );
};

// --- Component chính ---
const NavBar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false); 

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prev => !prev);
    setIsNotifyOpen(false); 
  };

  const toggleNotifyDropdown = () => {
    setIsNotifyOpen(prev => !prev);
    setIsUserDropdownOpen(false); 
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between 
                 px-4 backdrop-blur-lg bg-gradient-to-r from-white/85 via-blue-50/80 to-white/85 
                 shadow-lg border-b border-blue-100"
    >
      {/* --- KHU VỰC 1: Logo + Search --- */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="text-3xl font-bold text-blue-600 hover:scale-105 transition-transform">
          J<span className="text-gray-800">C</span>
        </Link>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc, người dùng..."
            className="h-10 w-72 rounded-full bg-gray-100/70 py-2 pl-10 pr-4 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       hover:bg-gray-100 transition-all duration-300"
          />
        </div>
      </div>

      {/* --- KHU VỰC 2: Navigation Center --- */}
      <div className="flex h-full items-center justify-center space-x-1">
        <NavItem to="/" icon={<Home size={22} />} label="Trang Chủ" />
        <NavItem to="/jobs" icon={<Briefcase size={22} />} label="Tìm Việc" />
        <NavItem to="/messages" icon={<MessageSquare size={22} />} label="Tin Nhắn" />
        <NavItem to="/cv-builder" icon={<FileText size={22} />} label="Tạo CV" />
        <NavItem to="/vip-package" icon={<Star size={22} />} label="Gói VIP" />
      </div>

      {/* --- KHU VỰC 3: Notify & User --- */}
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            {/* --- Bell Notification --- */}
            <div className="relative">
              <motion.button
                onClick={toggleNotifyDropdown}
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-full 
                           bg-gray-100/70 hover:bg-blue-100 text-gray-600 
                           transition-all duration-300"
              >
                <Bell size={20} />
              </motion.button>
              
              <AnimatePresence>
                {isNotifyOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white/95 
                               p-2 shadow-2xl ring-1 ring-blue-100 backdrop-blur-md"
                  >
                    <div className="px-3 py-2 text-base font-semibold text-blue-700 border-b border-blue-100">
                      Thông báo
                    </div>
                    <div className="h-56 overflow-y-auto custom-scrollbar">
                      <div className="p-3 text-sm text-gray-500 italic">Chưa có thông báo nào.</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- User Dropdown --- */}
            <div className="relative">
              <motion.button
                onClick={toggleUserDropdown}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 rounded-full px-2 pr-3 
                           hover:bg-gray-100/70 transition-all duration-300"
              >
                <motion.img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full border-2 border-blue-200"
                  whileHover={{ rotate: 8 }}
                />
                <span className="hidden font-semibold text-gray-700 md:block">{user.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl bg-white/95 
                               py-2 shadow-xl ring-1 ring-blue-100 backdrop-blur-md"
                  >
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <Settings size={16} /> Thông tin cá nhân
                    </Link>
                    <Link to="/change-password" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <Lock size={16} /> Đổi mật khẩu
                    </Link>

                    {user.role === 'Employer' ? (
                      <Link 
                        to="/employer/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <Briefcase size={16} /> Trang tuyển dụng
                      </Link>
                    ) : (
                      <Link 
                        to="/employer/register"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <Briefcase size={16} /> Đăng ký tuyển dụng
                      </Link>
                    )}

                    <hr className="my-1 border-blue-100" />

                    <Link to="/logout" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={16} /> Đăng xuất
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center space-x-2 rounded-full px-4 py-2 font-medium text-gray-700 
                         hover:bg-gray-100 transition-all duration-300"
            >
              <LogIn size={20} />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white 
                         hover:bg-blue-700 shadow-md transition-all duration-300"
            >
              <UserPlus size={20} />
              <span>Đăng ký</span>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;
