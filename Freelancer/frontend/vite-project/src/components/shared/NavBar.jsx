import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  Lock,
  Loader2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import friendService from '../../../services/friendService';
import notificationService from '../../../services/notificationService'; // Import service thông báo
import useDebounce from '../../hooks/useDebounce';
import { formatTimeAgo } from '../../utils/dateUtils'; // Import helper thời gian

// --- Helper Avatar ---
const getAvatarUrl = (name) => {
  if (!name) return 'https://ui-avatars.com/api/?name=?&background=random';
  const Fname = name.replace(/\s/g, '+'); 
  return `https://ui-avatars.com/api/?name=${Fname}&background=random&color=fff`;
}

// --- Component NavItem (Giữ nguyên) ---
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
        <span className="absolute inset-0 rounded-full bg-blue-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <div className="z-10">{icon}</div>
        <span className="text-xs font-medium mt-1 z-10">{label}</span>
      </motion.div>
    </NavLink>
  );
};

// --- Component chính ---
const NavBar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false); 

  // --- STATE CHO TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // --- STATE CHO THÔNG BÁO ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Debounce: Chờ 500ms sau khi ngừng gõ mới gọi API
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const searchContainerRef = useRef(null);

  // --- EFFECT 1: TÌM KIẾM ---
  useEffect(() => {
    const fetchUsers = async () => {
        if (!debouncedSearchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await friendService.searchUsers(debouncedSearchTerm);
            setSearchResults(response.data);
            setShowSearchResults(true);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        } finally {
            setIsSearching(false);
        }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  // --- EFFECT 2: LẤY THÔNG BÁO ---
  useEffect(() => {
    if (isAuthenticated) {
        const fetchNotifications = async () => {
            try {
                const res = await notificationService.getMyNotifications();
                setNotifications(res.data);
                // Đếm số chưa đọc
                const count = res.data.filter(n => !n.isRead).length;
                setUnreadCount(count);
            } catch (error) {
                console.error("Lỗi tải thông báo:", error);
            }
        };
        fetchNotifications();
        
        // (Optional) Có thể set interval để polling mỗi 30s
        // const interval = setInterval(fetchNotifications, 30000);
        // return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // --- HANDLERS ---
  
  // Ẩn dropdown search khi click ra ngoài
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
              setShowSearchResults(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (userId) => {
      setShowSearchResults(false);
      setSearchTerm(''); 
      navigate(`/user/${userId}`); 
  };

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

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  if (isLoading) {
    return (
       <nav className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 backdrop-blur-lg bg-gradient-to-r from-white/85 via-blue-50/80 to-white/85 shadow-lg border-b border-blue-100">
       </nav>
    );
  }

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
        
        {/* SEARCH BOX */}
        <div className="relative hidden md:block" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="h-10 w-72 rounded-full bg-gray-100/70 py-2 pl-10 pr-4 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      hover:bg-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
                if (searchResults.length > 0 || searchTerm) setShowSearchResults(true);
            }}
          />
          
          {/* Icon Loading */}
          {isSearching && (
             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
             </div>
          )}

          {/* SEARCH DROPDOWN */}
          <AnimatePresence>
            {showSearchResults && (searchResults.length > 0 || (searchTerm && !isSearching)) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div 
                                    key={result.userId}
                                    onClick={() => handleResultClick(result.userId)}
                                    className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition border-b border-gray-50 last:border-none"
                                >
                                    <img 
                                        src={getAvatarUrl(result.fullName)} 
                                        alt={result.fullName} 
                                        className="h-10 w-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 truncate">{result.fullName}</h4>
                                        <p className="text-xs text-gray-500 truncate">{result.headline || "Thành viên"}</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0
                                        ${result.role === 'Employer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {result.role === 'Employer' ? 'HR' : 'Seeker'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            !isSearching && searchTerm && (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    Không tìm thấy kết quả nào.
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
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
          <React.Fragment>
            {/* --- Bell Notification --- */}
            <div className="relative">
              <motion.button
                onClick={toggleNotifyDropdown}
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 10 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                  ${isNotifyOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100/70 text-gray-600 hover:bg-blue-100'}
                `}
              >
                <Bell size={20} />
                {/* Chấm đỏ thông báo */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {isNotifyOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white/95 
                               shadow-2xl ring-1 ring-blue-100 backdrop-blur-md overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-50/50">
                      <span className="text-sm font-bold text-blue-800">Thông báo</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                          Đánh dấu đã đọc
                        </span>
                      )}
                    </div>
                    
                    <div className="h-64 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <Link 
                            key={notif.id} 
                            to={notif.linkUrl || '#'} 
                            className={`flex items-start gap-3 p-3 hover:bg-blue-50 transition border-b border-gray-50 last:border-none
                                      ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                            onClick={() => setIsNotifyOpen(false)} // Đóng dropdown khi click
                          >
                            <div className="relative flex-shrink-0">
                                <img 
                                    src={getAvatarUrl(notif.actorFullName || "Hệ thống")} 
                                    alt="Avt" 
                                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                />
                                {/* Chấm xanh chưa đọc */}
                                {!notif.isRead && <div className="absolute bottom-0 right-0 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 leading-snug line-clamp-2">
                                    <span className="font-semibold">{notif.actorFullName || "Hệ thống"}</span> {notif.message.replace(notif.actorFullName, '').trim()}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} /> {formatTimeAgo(notif.createdDate)}
                                </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                           <Bell size={32} className="mb-2 opacity-20" />
                           <span className="text-sm italic">Chưa có thông báo nào.</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                        <Link to="/notifications" className="text-xs font-medium text-blue-600 hover:underline">
                            Xem tất cả
                        </Link>
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
                  src={getAvatarUrl(user.fullName)}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full border-2 border-blue-200"
                  whileHover={{ rotate: 8 }}
                />
                <span className="hidden font-semibold text-gray-700 md:block">
                  {user.fullName} 
                </span>
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

                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;