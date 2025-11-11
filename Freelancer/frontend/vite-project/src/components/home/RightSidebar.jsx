import React from 'react';
import { MessageCircle } from 'lucide-react';

const mockContacts = [
  { id: 1, name: 'Meta AI', avatar: 'https://ui-avatars.com/api/?name=MA&background=random', online: true },
  { id: 2, name: 'Đào Xuân Thông', avatar: 'https://ui-avatars.com/api/?name=DT&background=random', online: true },
  { id: 3, name: 'Nguyễn Danh Thái', avatar: 'https://ui-avatars.com/api/?name=NT&background=random', online: false },
  { id: 4, name: 'Văn Đức Trung', avatar: 'https://ui-avatars.com/api/?name=VT&background=random', online: true },
  { id: 5, name: 'Phan Bá Khánh Linh', avatar: 'https://ui-avatars.com/api/?name=PL&background=random', online: true },
  { id: 6, name: 'Hồ Thị Hồng Trâm', avatar: 'https://ui-avatars.com/api/?name=HT&background=random', online: false },
  { id: 7, name: 'Ngọc Ánh', avatar: 'https://ui-avatars.com/api/?name=NA&background=random', online: true },
  { id: 8, name: 'Lê Nga', avatar: 'https://ui-avatars.com/api/?name=LN&background=random', online: true },
  { id: 9, name: 'Lan Anh', avatar: 'https://ui-avatars.com/api/?name=LA&background=random', online: false },
];

const RightSidebar = ({ onUserClick }) => {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Khung chính */}
      <div
        className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-lg
                   border border-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-lg">Người liên hệ</h3>
          <MessageCircle className="h-5 w-5 text-gray-500" />
        </div>

        {/* Danh sách người liên hệ */}
        <ul className="mt-3 space-y-2">
          {mockContacts.map((user) => (
            <li
              key={user.id}
              onClick={() => onUserClick(user)}
              className="flex items-center space-x-3 cursor-pointer
                         rounded-xl p-2.5 border border-transparent
                         hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100
                         hover:border-gray-200 transition-all duration-300 group"
            >
              {/* Avatar + online badge */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm
                             group-hover:scale-105 transition-transform duration-200"
                />
                {user.online && (
                  <span
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white 
                               bg-green-500 shadow-[0_0_4px_#22c55e]"
                  ></span>
                )}
              </div>

              {/* Tên người dùng */}
              <div className="flex-1">
                <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                  {user.name}
                </span>
                <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                  {user.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </p>
              </div>

              {/* Hiệu ứng mở chat (nút “ẩn”) */}
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           text-blue-500 hover:text-blue-600"
              >
                <MessageCircle className="h-4 w-4" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
