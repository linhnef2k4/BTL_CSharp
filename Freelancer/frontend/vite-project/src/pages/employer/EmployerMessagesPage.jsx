import React, { useState } from 'react';
// --- "LINH KIỆN" (COMPONENTS) "MỚI" (NEW) "CHO" (FOR) "EMPLOYER" (EMPLOYER) ---
import EmployerChatList from '../../components/employer/EmployerChatList'; // <-- Sắp "tạo" (create) (File 2/3)

// --- "TÁI SỬ DỤNG" (REUSE) "LINH KIỆN" (COMPONENTS) "XỊN" (PRO) "CỦA" (OF) "SEEKER" (SEEKER) ---
import ChatWindow from '../../components/messages/ChatWindow'; // <-- "Lấy" (Get) "từ" (from) "bộ" (set) "Seeker" (Seeker)
import ChatDetails from '../../components/messages/ChatDetails'; // <-- "Lấy" (Get) "từ" (from) "bộ" (set) "Seeker" (Seeker)

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "EMPLOYER" (EMPLOYER) ---

// 1. "Các" (The) "chat" (chats) "đã" (already) "được" (been) "chấp nhận" (accepted) (HỘP THƯ)
const MOCK_INBOX = [
  { id: 1, name: 'Minh Tuấn (Seeker)', avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan', lastMessage: 'Em cảm ơn, em sẽ có mặt ạ!', time: '10 phút trước', online: true, status: 'Đã hẹn phỏng vấn' },
  { id: 2, name: 'Ngọc Ánh', avatar: 'https://ui-avatars.com/api/?name=Ngoc+Anh', lastMessage: 'Vâng, em gửi CV ạ.', time: '1 giờ trước', online: false, status: 'Đã qua vòng CV' },
];

// 2. "Các" (The) "chat" (chats) "đang" (are) "chờ" (waiting) "duyệt" (review) (TIN NHẮN CHỜ - TỪ "VIP SEEKER")
const MOCK_REQUESTS = [
  { id: 3, name: 'Phan Bá Khánh Linh (VIP)', avatar: 'https://ui-avatars.com/api/?name=Khanh+Linh', lastMessage: 'Chào FPT, em thấy...', time: '5 giờ trước', online: true, status: 'Tin nhắn chờ từ Seeker VIP' },
  { id: 4, name: 'Lê Nga (VIP)', avatar: 'https://ui-avatars.com/api/?name=Le+Nga', lastMessage: 'Em rất quan tâm...', time: '1 ngày trước', online: false, status: 'Tin nhắn chờ từ Seeker VIP' },
];
// ------------------------------------

const EmployerMessagesPage = () => {
  // --- "BỘ NÃO" (BRAIN) ---
  const [activeFilter, setActiveFilter] = useState('Hộp thư'); // "Hộp thư" | "Tin nhắn chờ"
  const [showDetails, setShowDetails] = useState(true);

  // "Logic" (Logic) "chọn" (select) "list" (list) "dữ liệu" (data) "để" (to) "hiển thị" (display)
  const contacts = activeFilter === 'Hộp thư' ? MOCK_INBOX : MOCK_REQUESTS;
  
  // "Quản lý" (Manage) "ai" (who) "đang" (is) "được" (being) "chọn" (selected)
  const [activeChat, setActiveChat] = useState(contacts[0]);

  // "Khi" (When) "đổi" (change) "filter" (filter)
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // "Tự động" (Auto) "chọn" (select) "người" (person) "đầu tiên" (first) "trong" (in) "list" (list) "mới" (new)
    if (filter === 'Hộp thư') {
      setActiveChat(MOCK_INBOX[0]);
    } else {
      setActiveChat(MOCK_REQUESTS[0]);
    }
  };

  return (
    // "Layout" (Layout) "3" (three) "cột" (columns) "full" (full) "chiều cao" (height) "của" (of) "vùng" (area) "làm việc" (workspace)
    <div className="flex h-[calc(100vh-8.5rem)] bg-white">
      
      {/* CỘT 1: DANH BẠ (ChatList) (Sắp "tạo" (create) File 2/3) */}
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <EmployerChatList
          contacts={contacts} // "Truyền" (Pass) "list" (list) "data" (data) "đúng" (correct) "xuống" (down)
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange} // "Truyền" (Pass) "hàm" (function) "đổi" (change) "filter" (filter) "xuống" (down)
        />
      </div>

      {/* CỘT 2: KHUNG CHAT (ChatWindow) (Tái "sử dụng" (reuse)) */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow
            activeUser={activeChat}
            onToggleDetails={() => setShowDetails(prev => !prev)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">
              {activeFilter === 'Hộp thư' 
                ? 'Chưa có tin nhắn nào trong Hộp thư.' 
                : 'Chưa có Tin nhắn chờ nào.'
              }
            </p>
          </div>
        )}
      </div>

      {/* CỘT 3: THÔNG TIN (ChatDetails) (Tái "sử dụng" (reuse)) */}
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

export default EmployerMessagesPage;