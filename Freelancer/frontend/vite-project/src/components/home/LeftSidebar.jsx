import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <<< 1. IMPORT USEAUTH

// Hàm tạo avatar (giống như trong NavBar)
const getAvatarUrl = (user) => {
  if (user?.seeker?.avatarUrl) {
    return user.seeker.avatarUrl;
  }
  const name = user?.fullName?.replace(/\s/g, '+') || '?';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
}

const LeftSidebar = () => {
  // <<< 2. LẤY DATA TỪ CONTEXT
  const { user, isLoading } = useAuth();

  // <<< 3. XỬ LÝ LOADING VÀ CHƯA LOGIN
  // Nếu đang tải hoặc chưa đăng nhập, không hiển thị gì
  if (isLoading || !user) {
    // Hoặc bạn có thể trả về 1 skeleton loading
    return (
      <div className="sticky top-20 space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="h-24 w-full bg-gray-200 animate-pulse"></div>
          <div className="relative flex justify-center -mt-10">
            <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-300 animate-pulse"></div>
          </div>
          <div className="mt-4 px-4 pb-4 text-center">
            <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 mx-auto bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // <<< 4. KHI ĐÃ CÓ DATA USER
  return (
    <div className="sticky top-20 space-y-4">
      
      {/* 🔹 CARD THÔNG TIN USER (ĐÃ CẬP NHẬT) */}
      <div
        className="overflow-hidden rounded-2xl bg-white shadow-md
                   transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Cover Image (Giữ nguyên) */}
        <div className="relative h-24 w-full overflow-hidden">
          <img
            src={'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80'}
            alt="cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30"></div>
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-400/20 blur-2xl"></div>
        </div>

        {/* Avatar (Đã cập nhật) */}
        <div className="relative flex justify-center -mt-10">
          <div className="relative">
            <img
              src={getAvatarUrl(user)} // <<< Dùng data thật
              alt="Avatar"
              className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Vòng pulse chỉ hiển thị nếu là VIP */}
            {user.seeker?.isVip && (
              <div className="absolute inset-0 rounded-full ring-2 ring-yellow-500/30 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Thông tin user (Đã cập nhật) */}
        <div className="mt-4 px-4 pb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">
            {user.fullName} {/* <<< Dùng data thật */}
          </h3>
          <p className="text-sm text-gray-500">
            {user.seeker?.headline || '(Chưa cập nhật tiêu đề)'} {/* <<< Dùng data thật */}
          </p>

          <div className="mx-auto my-3 w-16 border-b-2 border-blue-500/40 rounded-full"></div>

          {/* Trạng thái VIP (Đã cập nhật logic) */}
          <div className="mt-3 flex justify-center">
            {/* <<< Dùng data thật (user.seeker.isVip) */}
            {user.seeker?.isVip ? ( 
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                ⭐ VIP Member
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                Thành viên thường
              </span>
            )}
          </div>

          {/* <<< Đã xóa phần Connections và Ứng viên tiềm năng */}
        </div>
      </div>

      {/* 🔹 CARD NAVIGATION (Giữ nguyên) */}
      <div
        className="rounded-2xl bg-white p-4 shadow-md
                   transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
      >
        <nav className="space-y-2">
          <Link
            to="/saved"
            className="group flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100
                       transition-colors duration-200"
          >
            <Bookmark className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-blue-600">Đã lưu</span>
          </Link>

          <Link
            to="/friends"
            className="group flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100
                       transition-colors duration-200"
          >
            <Users className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-blue-600">Bạn bè</span>
          </Link>

          <Link
            to="/trash"
            className="group flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100
                       transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-blue-600">Thùng rác</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;