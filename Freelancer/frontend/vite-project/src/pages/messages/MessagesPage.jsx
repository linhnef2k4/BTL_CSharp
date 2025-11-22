import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from '../../context/AuthContext';
import api from '../../../services/api';
import ChatList from '../../components/messages/ChatList';
import ChatWindow from '../../components/messages/ChatWindow';
import ChatDetails from '../../components/messages/ChatDetails';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  
  // --- KHẮC PHỤC LỖI KHÔNG LOAD TIN NHẮN NGAY ---
  // Dùng Ref để lưu trữ ID cuộc hội thoại đang mở
  // Giúp SignalR đọc được giá trị mới nhất mà không cần phụ thuộc state
  const activeChatIdRef = useRef(activeChatId);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);
  // ----------------------------------------------

  // 1. Khởi tạo SignalR
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7051/chathub", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  // 2. Kết nối & Lắng nghe
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR Connected!');

          connection.on('ReceiveMessage', (message) => {
            // Dùng Ref để lấy ID hiện tại
            const currentOpenChatId = activeChatIdRef.current;

            // A. Nếu đang mở đúng chat -> Thêm tin nhắn vào màn hình ngay
            if (currentOpenChatId && message.conversationId === currentOpenChatId) {
                setMessages((prev) => [...prev, message]);
            }

            // B. Cập nhật danh sách bên trái (Preview & Unread)
            setConversations((prev) => {
               const updatedList = prev.map(conv => {
                   if (conv.id === message.conversationId) {
                       return { 
                           ...conv, 
                           lastMessage: message.type === 'Image' ? 'Đã gửi một ảnh' : (message.type === 'File' ? 'Đã gửi một tệp' : message.content),
                           lastMessageDate: message.sentDate,
                           unreadCount: (currentOpenChatId === message.conversationId) ? 0 : (conv.unreadCount + 1)
                       };
                   }
                   return conv;
               });
               // Đẩy chat mới lên đầu
               return updatedList.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
            });
          });
        })
        .catch(err => console.error('SignalR Connect Error:', err));
    }

    return () => {
      if (connection) connection.stop();
    };
  }, [connection]); // Chỉ chạy 1 lần khi có connection

  // 3. Lấy danh sách Chat ban đầu
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error("Lỗi tải conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  // 4. Lấy lịch sử tin nhắn khi chọn chat
  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/conversations/${activeChatId}/messages`);
          setMessages(res.data);
          
          // Reset unread count ở danh sách locally
          setConversations(prev => prev.map(c => c.id === activeChatId ? {...c, unreadCount: 0} : c));
        } catch (error) {
          console.error("Lỗi tải messages:", error);
        }
      };
      fetchMessages();
    }
  }, [activeChatId]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex border border-gray-100">
        
        {/* LEFT SIDEBAR */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <ChatList 
            conversations={conversations} 
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
          />
        </div>

        {/* MAIN CHAT */}
        <div className={`flex-1 flex flex-col ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChatId && activeChat ? (
            <ChatWindow 
              chat={activeChat}
              messages={messages}
              currentUser={user}
              connection={connection}
              onBack={() => setActiveChatId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 bg-gray-50">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <span className="text-4xl">💬</span>
              </div>
              <p className="text-lg font-medium">Chọn một cuộc hội thoại để bắt đầu</p>
            </div>
          )}
        </div>

        {/* RIGHT DETAILS (Ẩn trên màn nhỏ) */}
        {activeChatId && activeChat && (
          <div className="hidden xl:block w-80 border-l border-gray-100">
            <ChatDetails chat={activeChat} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;