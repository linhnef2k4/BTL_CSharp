import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Users, Trash2 } from 'lucide-react';

const LeftSidebar = ({ user }) => {
  return (
    <div className="sticky top-20 space-y-4">
      
      {/* 🔹 CARD THÔNG TIN USER */}
      <div
        className="overflow-hidden rounded-2xl bg-white shadow-md
                   transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Cover Image hiện đại */}
        <div className="relative h-24 w-full overflow-hidden">
          <img
            src={
              user.cover ||
              'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80'
            }
            alt="cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30"></div>
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-blue-400/20 blur-2xl"></div>
        </div>

        {/* Avatar nổi bật */}
        <div className="relative flex justify-center -mt-10">
          <div className="relative">
            <img
              src={user.avatar}
              alt="Avatar"
              className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/30 animate-pulse"></div>
          </div>
        </div>

        {/* Thông tin user */}
        <div className="mt-4 px-4 pb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500">{user.title}</p>

          {/* 🌟 Line chia sang trọng dưới phần title */}
          <div className="mx-auto my-3 w-16 border-b-2 border-blue-500/40 rounded-full"></div>

          {/* Trạng thái VIP */}
          <div className="mt-3 flex justify-center">
            {user.status === 'VIP' ? (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                ⭐ VIP Member
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                Thành viên thường
              </span>
            )}
          </div>

          {/* Connections */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Kết nối:</span>
            <span className="font-semibold text-blue-600">{user.connections}</span>
          </div>

          {/* Ứng viên tiềm năng */}
          {user.isPotential && (
            <div className="mt-3">
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 shadow-sm">
                🌱 Ứng viên tiềm năng
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 CARD NAVIGATION */}
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
