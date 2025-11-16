import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
// <<< 1. SỬA LỖI: Thêm .jsx để bundler tìm thấy file
import { useAuth } from '../../context/AuthContext.jsx'; 
import axios from 'axios'; // <<< 1. IMPORT

// Xóa mockContacts
// const mockContacts = [ ... ];

// Hàm tạo avatar
const getAvatarUrl = (name) => {
  const Fname = name?.replace(/\s/g, '+') || '?';
  return `https://ui-avatars.com/api/?name=${Fname}&background=random&color=fff`;
}

const RightSidebar = ({ onUserClick }) => {
  const [friends, setFriends] = useState([]); // <<< 2. State cho bạn bè thật
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth(); // <<< 2. Lấy trạng thái đăng nhập

  // <<< 3. useEffect để gọi API
  useEffect(() => {
    // Chỉ gọi API nếu đã đăng nhập
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchFriends = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/friends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // DTO trả về: [{ friendId, friendFullName, friendHeadline, ... }]
        setFriends(response.data); 
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [isAuthenticated]); // Chạy lại nếu trạng thái đăng nhập thay đổi

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

        {/* <<< 4. HIỂN THỊ CÓ ĐIỀU KIỆN */}
        <ul className="mt-3 space-y-2">
          {isLoading ? (
            // Trạng thái Loading
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : !friends.length ? (
            // Trạng thái không có bạn bè
            <li className="p-2.5 text-sm text-gray-500 italic">
              Bạn chưa có người bạn nào.
            </li>
          ) : (
            // <<< 5. HIỂN THỊ DANH SÁCH BẠN BÈ THẬT
            friends.map((friend) => (
              <li
                key={friend.friendId} // Dùng key thật
                onClick={() => onUserClick(friend)} // Gửi object friend thật
                className="flex items-center space-x-3 cursor-pointer
                           rounded-xl p-2.5 border border-transparent
                           hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100
                           hover:border-gray-200 transition-all duration-300 group"
              >
                {/* Avatar + online badge */}
                <div className="relative">
                  <img
                    src={getAvatarUrl(friend.friendFullName)} // Dùng tên thật
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm
                               group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* TODO: Tạm thời ẩn online status vì API không có */}
                  {/* {user.online && ( ... )} */}
                </div>

                {/* Tên người dùng */}
                <div className="flex-1">
                  <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {friend.friendFullName} {/* Dùng tên thật */}
                  </span>
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors truncate">
                    {/* Dùng headline, nếu không có thì dùng email */}
                    {friend.friendHeadline || friend.friendEmail || '...'} 
                  </p>
                </div>

                {/* Hiệu ứng mở chat */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                             text-blue-500 hover:text-blue-600"
                >
                  <MessageCircle className="h-4 w-4" />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;