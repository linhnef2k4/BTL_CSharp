import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Loader2 } from 'lucide-react';

// Import các component dùng chung
import ChatList from '../../components/messages/ChatList';
import ChatWindow from '../../components/messages/ChatWindow';
import ChatDetails from '../../components/messages/ChatDetails';

import conversationService from '../../../services/conversationService';
import { useAuth } from '../../context/AuthContext';

// URL của SignalR Hub (Đảm bảo khớp với Backend)
const HUB_URL = 'https://localhost:7051/chatHub'; 

const EmployerMessagesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // --- STATE ---
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  // Lấy object chat đang active dựa trên ID
  const activeChat = conversations.find(c => c.id === activeChatId);

  // --- 1. KHỞI TẠO SIGNALR ---
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('authToken') // Gửi Token để xác thực
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  // --- 2. KẾT NỐI & LẮNG NGHE SỰ KIỆN ---
  useEffect(() => {
    // Chỉ chạy khi có connection và user đã load xong
    if (connection && user) {
      connection.start()
        .then(() => console.log('SignalR Connected!'))
        .catch(err => console.error('SignalR Connection Error: ', err));

      // Lắng nghe tin nhắn mới
      connection.on("ReceiveMessage", (messageDto) => {
        // A. Cập nhật danh sách tin nhắn (Nếu đang mở đúng hội thoại đó)
        if (activeChatId === messageDto.conversationId) { 
           setMessages(prev => [...prev, messageDto]);
        }

        // B. Cập nhật danh sách hội thoại
        setConversations(prev => {
           const updatedList = prev.map(conv => {
              if (conv.id === messageDto.conversationId) { 
                 return {
                    ...conv,
                    lastMessage: messageDto.type === 'Image' ? 'Đã gửi một ảnh' : 
                                 messageDto.type === 'File' ? 'Đã gửi một tệp' : messageDto.content,
                    lastMessageDate: messageDto.sentDate,
                    // FIX LỖI Ở ĐÂY: Dùng user?.id để tránh crash nếu user null
                    unreadCount: (messageDto.senderId !== user?.id && activeChatId !== conv.id) 
                                 ? conv.unreadCount + 1 
                                 : conv.unreadCount
                 };
              }
              return conv;
           });
           
           return updatedList.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
        });
      });
    }
    
    // Cleanup listener khi unmount hoặc deps thay đổi để tránh duplicate listener
    return () => {
        if (connection) {
            connection.off("ReceiveMessage");
        }
    };
  }, [connection, activeChatId, user?.id]); // FIX LỖI Ở ĐÂY: Thêm optional chaining user?.id

  // --- 3. LẤY DANH SÁCH HỘI THOẠI ---
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await conversationService.getMyConversations();
        setConversations(res.data);

        // Xử lý điều hướng từ nút "Nhắn tin"
        const state = location.state;
        if (state?.selectedConversationId) {
            const target = res.data.find(c => c.id === state.selectedConversationId);
            if (target) {
                setActiveChatId(target.id);
            } else if (state.chatWith) {
                const newConv = {
                    id: state.selectedConversationId,
                    otherParticipantId: state.chatWith.id,
                    otherParticipantFullName: state.chatWith.fullName,
                    otherParticipantAvatar: state.chatWith.avatar,
                    otherParticipantHeadline: "Thành viên",
                    lastMessage: "",
                    lastMessageDate: new Date().toISOString(),
                    unreadCount: 0
                };
                setConversations(prev => [newConv, ...prev]);
                setActiveChatId(newConv.id);
            }
        }
      } catch (error) {
        console.error("Lỗi tải hội thoại:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [location.state]);

  // --- 4. LẤY TIN NHẮN CỦA HỘI THOẠI ĐANG CHỌN ---
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const res = await conversationService.getMessages(activeChatId);
        setMessages(res.data);
        
        setConversations(prev => prev.map(c => 
           c.id === activeChatId ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden border-t border-gray-200">
       {/* CỘT 1: DANH SÁCH CHAT */}
       <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-auto flex-shrink-0`}>
           <ChatList 
              conversations={conversations}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
           />
       </div>

       {/* CỘT 2: KHUNG CHAT */}
       <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 bg-gray-50`}>
           {activeChatId ? (
              <ChatWindow 
                 chat={activeChat}
                 messages={messages}
                 currentUser={user}
                 connection={connection}
                 onBack={() => setActiveChatId(null)} 
              />
           ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                 <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                 <p>Chọn một cuộc hội thoại để bắt đầu</p>
              </div>
           )}
       </div>

       {/* CỘT 3: THÔNG TIN */}
       {activeChatId && showDetails && (
           <div className="hidden lg:block border-l border-gray-200 w-80 bg-white">
               <ChatDetails activeChat={activeChat} />
           </div>
       )}
    </div>
  );
};

import { MessageSquare } from 'lucide-react';
export default EmployerMessagesPage;