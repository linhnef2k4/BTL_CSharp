import React, { useState } from 'react';
import ChatList from '../../components/messages/ChatList';
import ChatWindow from '../../components/messages/ChatWindow';
import ChatDetails from '../../components/messages/ChatDetails';

// Dữ liệu "giả" (sẽ dùng chung)
const MOCK_CONTACTS = [
  { id: 1, name: 'Trịnh Xuân Thi', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Báo nó gửi file đi...', time: '45 phút trước', online: true, status: 'Hoạt động 45 phút trước' },
  { id: 2, name: 'Nhóm 4 anh Tài', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'Huy: Thật nghiệp hết 😃', time: '10 giờ', online: false, isGroup: true, status: 'Nhóm' },
  { id: 3, name: 'Troam', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'KK oce - 11 giờ - Trả lời?', time: '11 giờ', online: false, status: 'Hoạt động 11 giờ trước' },
  { id: 4, name: 'Ngọc Ánh', avatar: 'https://i.pravatar.cc/150?img=4', lastMessage: 'Cuộc gọi video đã kết thúc', time: '11 giờ', online: false, status: 'Hoạt động 1 ngày trước' },
  { id: 5, name: 'Trai Làng', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'b MNN là tồn thương 🙂', time: '11 giờ', online: true, isGroup: true, status: 'Nhóm' },
  { id: 6, name: 'Phan Bá Khánh Linh', avatar: 'https://i.pravatar.cc/150?img=6', lastMessage: 'Yêu - 15 giờ', time: '15 giờ', online: false, status: 'Hoạt động 15 giờ trước' },
];

const MessagesPage = () => {
  // "Bộ não" quản lý: Ai đang được chọn?
  const [activeChat, setActiveChat] = useState(MOCK_CONTACTS[0]); // Mặc định chọn người đầu tiên
  // Quản lý cột phải (Info)
  const [showDetails, setShowDetails] = useState(true);

  return (
    // Layout 3 cột, full-screen (trừ cái navbar 16 (h-16))
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      
      {/* CỘT 1: DANH BẠ (ChatList) */}
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <ChatList
          contacts={MOCK_CONTACTS}
          activeChat={activeChat}
          onSelectChat={setActiveChat} // <-- Khi click, "báo" lên đây
        />
      </div>

      {/* CỘT 2: KHUNG CHAT (ChatWindow) */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow
            activeUser={activeChat}
            onToggleDetails={() => setShowDetails(prev => !prev)} // <-- Ra lệnh "đóng/mở"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Chọn một đoạn chat để bắt đầu</p>
          </div>
        )}
      </div>

      {/* CỘT 3: THÔNG TIN (ChatDetails) */}
      {showDetails && activeChat && (
        <div className="w-96 flex-shrink-0 border-l border-gray-200">
          <ChatDetails
            activeUser={activeChat}
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;