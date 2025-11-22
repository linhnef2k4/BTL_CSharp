import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const getAvatarUrl = (user) => {
  if (user?.seeker?.avatarUrl) {
    return user.seeker.avatarUrl;
  }
  const name = user?.fullName?.replace(/\s/g, '+') || 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
}

const LeftSidebar = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation(); // Dùng để highlight menu đang chọn

  // Helper để kiểm tra active link
  const isActive = (path) => location.pathname === path;
  const getLinkClass = (path) => `group flex items-center space-x-3 rounded-lg p-3 transition-colors duration-200 ${
      isActive(path) 
      ? 'bg-blue-50 text-blue-600 font-semibold' 
      : 'hover:bg-gray-100 text-gray-700'
  }`;

  if (isLoading || !user) {
    return (
      <div className="sticky top-20 space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 p-4">
           <div className="animate-pulse flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-4">
      
      {/* 🔹 CARD THÔNG TIN USER */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        {/* Cover Image */}
        <div className="relative h-24 w-full bg-gray-200">
           <img
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80"
            alt="cover"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center -mt-10">
          <Link to={`/profile/${user.id}`}>
             <img
                src={getAvatarUrl(user)}
                alt="Avatar"
                className="h-20 w-20 rounded-full border-4 border-white shadow-md object-cover cursor-pointer hover:opacity-90 transition"
             />
          </Link>
          {user.seeker?.isVip && (
              <span className="absolute bottom-0 bg-yellow-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm border-2 border-white">
                VIP
              </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 px-4 pb-5 text-center">
          <Link to={`/profile/${user.id}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                {user.fullName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-1">
            {user.seeker?.headline || 'Thành viên mới'}
          </p>
        </div>
      </div>

      {/* 🔹 CARD NAVIGATION */}
      <div className="rounded-2xl bg-white p-2 shadow-sm border border-gray-100">
        <nav className="space-y-1">
          <Link to="/friends" className={getLinkClass('/friends')}>
            <Users size={20} className={isActive('/friends') ? 'text-blue-600' : 'text-gray-500'} />
            <span>Bạn bè</span>
          </Link>

          <Link to="/saved" className={getLinkClass('/saved')}>
            <Bookmark size={20} className={isActive('/saved') ? 'text-blue-600' : 'text-gray-500'} />
            <span>Đã lưu</span>
          </Link>

          <Link to="/trash" className={getLinkClass('/trash')}>
            <Trash2 size={20} className={isActive('/trash') ? 'text-blue-600' : 'text-gray-500'} />
            <span>Thùng rác</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;