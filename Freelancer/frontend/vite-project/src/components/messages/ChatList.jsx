import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getAvatarUrl } from '../../utils/imageUrl';

const ChatList = ({ conversations, activeChatId, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Logic lọc danh sách theo từ khóa tìm kiếm
  const filteredConversations = conversations.filter(chat => {
    const name = chat.otherParticipantFullName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tin nhắn</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm người dùng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* List Chat */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((chat) => {
            const isActive = chat.id === activeChatId;
            
            // Lấy thông tin từ API (Cấu trúc phẳng của DTO ConversationDto)
            const name = chat.otherParticipantFullName || "Người dùng";
            const avatar = getAvatarUrl(chat.otherParticipantAvatar, name);
            
            // Xử lý hiển thị nội dung tin nhắn cuối (Preview)
            let lastMsg = chat.lastMessage || "Bắt đầu trò chuyện";
            // Nếu tin nhắn là link ảnh/file (dựa vào nội dung)
            if (lastMsg.includes("/uploads/") || lastMsg.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                lastMsg = "Đã gửi một tệp đính kèm 📎";
            }

            // Xử lý hiển thị thời gian (Fix lỗi lệch múi giờ)
            let timeDisplay = "";
            if (chat.lastMessageDate) {
                // Thêm 'Z' nếu backend trả về thiếu timezone để đảm bảo là UTC
                const dateStr = chat.lastMessageDate.endsWith('Z') ? chat.lastMessageDate : chat.lastMessageDate + 'Z';
                try {
                    timeDisplay = formatDistanceToNow(new Date(dateStr), { addSuffix: false, locale: vi });
                } catch (e) {
                    timeDisplay = "";
                }
            }

            return (
              <div 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                  isActive 
                    ? 'bg-blue-50 border-blue-600' 
                    : 'border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={avatar} 
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                    onError={(e) => e.target.src = getAvatarUrl(null, name)}
                  />
                  {/* Online Indicator (Giả lập) */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold truncate text-[15px] ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                      {name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {timeDisplay}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                      <p className={`text-sm truncate w-[85%] ${isActive ? 'text-blue-600' : 'text-gray-500'} ${(!chat.isRead && !isActive) ? 'font-bold text-gray-800' : ''}`}>
                         {lastMsg}
                      </p>
                      
                      {/* Số tin nhắn chưa đọc */}
                      {chat.unreadCount > 0 && (
                          <span className="flex-shrink-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                              {chat.unreadCount}
                          </span>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
             <p>Không tìm thấy kết quả nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;