import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ChatList from '../../components/messages/ChatList';
import ChatWindow from '../../components/messages/ChatWindow';
import ChatDetails from '../../components/messages/ChatDetails';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [connection, setConnection] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  // Ref để giữ giá trị mới nhất của activeChat trong callback của SignalR
  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // 1. Khởi tạo SignalR & Lấy danh sách chat
  useEffect(() => {
    const initChat = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // A. Lấy danh sách hội thoại (API 2)
      try {
        const res = await axios.get('/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
        // Mặc định chọn hội thoại đầu tiên nếu có
        if (res.data.length > 0 && !activeChat) {
             // Logic chọn mặc định có thể thêm ở đây nếu muốn
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách chat:", err);
      }

      // B. Kết nối SignalR
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:7051/chathub", {
          accessTokenFactory: () => token // Gửi token để authorize
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      newConnection.on("ReceiveMessage", (messageDto) => {
        // Khi có tin nhắn mới:
        setConversations(prev => {
          // 1. Tìm xem cuộc trò chuyện đã tồn tại chưa
          const existingConvIndex = prev.findIndex(c => c.id === messageDto.conversationId); // Lưu ý: Backend cần trả về conversationId trong MessageDto (hoặc bạn phải suy luận)
          
          // Tạm thời logic: Nếu tìm thấy thì update, nếu không thì reload lại list (cho an toàn)
          // Để đơn giản cho UI: Ta sẽ update LastMessage của conversation tương ứng
          const updatedList = [...prev];
          if (existingConvIndex !== -1) {
             const conv = updatedList[existingConvIndex];
             conv.lastMessage = messageDto.content;
             conv.lastMessageDate = messageDto.sentDate;
             conv.isRead = false;
             // Đưa lên đầu
             updatedList.splice(existingConvIndex, 1);
             updatedList.unshift(conv);
          }
          return updatedList;
        });
      });

      try {
        await newConnection.start();
        console.log("SignalR Connected!");
        setConnection(newConnection);
      } catch (e) {
        console.error("SignalR Connection Error: ", e);
      }
    };

    initChat();

    // Cleanup khi rời trang
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    // Layout 3 cột, full-screen (trừ cái navbar 16 (h-16))
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      
      {/* CỘT 1: DANH BẠ (ChatList) */}
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <ChatList
          conversations={conversations} // Truyền danh sách thật
          activeChat={activeChat}
          onSelectChat={setActiveChat} // <-- Khi click, "báo" lên đây
        />
      </div>

      {/* CỘT 2: KHUNG CHAT (ChatWindow) */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow
            activeChat={activeChat} // Truyền object ConversationDto
            currentUser={user}
            connection={connection} // Truyền kết nối SignalR xuống để gửi tin
            onToggleDetails={() => setShowDetails(prev => !prev)}
            // Callback để update lại list khi mình tự gửi tin nhắn
            onMessageSent={(convId, msgText) => {
                setConversations(prev => {
                    const idx = prev.findIndex(c => c.id === convId);
                    if (idx === -1) return prev;
                    const updated = [...prev];
                    const conv = updated[idx];
                    conv.lastMessage = msgText;
                    conv.lastMessageDate = new Date().toISOString();
                    updated.splice(idx, 1);
                    updated.unshift(conv);
                    return updated;
                });
            }}
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
            activeChat={activeChat}
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;