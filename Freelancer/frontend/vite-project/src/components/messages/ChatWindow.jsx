import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, PlusCircle, Image, Paperclip, Smile, Send, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// Emoji "tượng trưng"
const EMOJIS = ['😀', '😂', '😍', '👍', '❤️'];

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${name?.replace(' ', '+')}&background=random&color=fff`;

const MessageBubble = ({ msg, isMine, showAvatar, senderName }) => (
  <div className={`flex items-end ${isMine ? 'flex-row-reverse' : 'space-x-2'}`}>
    {!isMine && (
      <div title={senderName}>
        <img 
            src={showAvatar ? getAvatarUrl(senderName) : ''} 
            alt="" 
            className={`h-7 w-7 rounded-full ${showAvatar ? '' : 'invisible'}`} 
        />
      </div>
    )}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`max-w-xs rounded-2xl px-3 py-2 text-sm lg:max-w-md break-words
        ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
      `}
    >
      {msg.content}
    </motion.div>
  </div>
);

const ChatWindow = ({ activeChat, currentUser, connection, onToggleDetails, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Load Lịch sử tin nhắn khi activeChat thay đổi
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        const res = await axios.get(`/api/conversations/${activeChat.id}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // API trả về MessageDto[]
        setMessages(res.data);
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();
    setNewMessage('');
    
    // Đánh dấu đã đọc (API SignalR)
    if (connection && connection.state === "Connected") {
        connection.invoke("MarkAsRead", activeChat.id)
            .catch(e => console.error("MarkAsRead fail", e));
    }

  }, [activeChat]);

  // 2. Lắng nghe tin nhắn mới qua SignalR
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = (messageDto) => {
      // Quan trọng: Chỉ thêm tin nhắn vào list NẾU tin nhắn đó thuộc về đoạn chat đang mở
      // Vì backend gửi broadcast ID user, nên user có thể nhận tin từ người khác khi đang chat với A
      // Nhưng ở ChatWindow này ta chỉ quan tâm tin nhắn của conversation hiện tại.
      // DTO backend cần có conversationId để check, hoặc ta check senderId.
      
      // Giả định: Chúng ta biết activeChat.id. Backend nên trả về conversationId trong MessageDto để chắc chắn.
      // Nếu backend chưa trả conversationId trong messageDto, ta check logic tạm:
      // Nếu người gửi là người mình đang chat HOẶC người gửi là chính mình (mình chat ở tab khác)
      
      // Tạm thời thêm luôn, nhưng logic đúng là phải check ID
       setMessages(prev => [...prev, messageDto]);
       scrollToBottom();
    };

    // Đăng ký lại event handler mỗi khi activeChat thay đổi để closure lấy đúng activeChat
    // (Hoặc xử lý ở parent MessagesPage tốt hơn, nhưng làm ở đây cho gọn demo)
    // Tuy nhiên, MessagesPage đã đăng ký on("ReceiveMessage"). 
    // SignalR cho phép nhiều handler.
    
    // LƯU Ý: Để tránh duplicate, ta nên dùng Ref hoặc check ID kĩ. 
    // Ở đây ta hook vào MessagesPage truyền props xuống hoặc xử lý trực tiếp.
    // Code dưới đây chỉ là xử lý local state.
    
    connection.on("ReceiveMessage", (msg) => {
         // Chỉ append nếu tin nhắn thuộc conversation này (hoặc từ người mình đang chat)
         // Do DTO MessageDto hiện tại chưa thấy có ConversationId, ta check senderId
         if (msg.senderId === activeChat.otherParticipantId || msg.senderId === currentUser.id) {
             // Tuy nhiên nếu msg.senderId === currentUser.id thì có thể bị duplicate do hàm send phía dưới đã add rồi.
             // Cần check id để tránh trùng
             setMessages(prev => {
                 if (prev.some(m => m.id === msg.id)) return prev;
                 return [...prev, msg];
             });
             scrollToBottom();
         }
    });

    return () => {
        connection.off("ReceiveMessage");
    };

  }, [connection, activeChat, currentUser]);

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  // Hàm gửi tin nhắn (SignalR)
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !connection) return;

    try {
        // Gọi Server Hub
        await connection.invoke("SendMessage", activeChat.id, newMessage);
        
        // Optimistic UI update (thêm ngay vào list không cần chờ server phản hồi)
        // Tuy nhiên, Hub của bạn "Clients.Users(...)" cũng gửi lại cho chính Sender.
        // Nên ta có thể đợi server gửi lại, HOẶC thêm ngay. 
        // Nếu thêm ngay, phải cẩn thận trùng lặp khi server gửi lại sự kiện ReceiveMessage.
        
        // Cách an toàn nhất với code backend hiện tại (gửi cho all participants trừ sender? check lại backend)
        // Backend: "var participantIds = ... (trừ mình)" -> SAI, logic chat thường gửi cho cả sender để đồng bộ các thiết bị.
        // Nhưng code backend bạn gửi: `Where(cu => cu.ConversationId == conversationId)` -> Cái này LẤY TẤT CẢ, bao gồm cả sender.
        // Vậy nên Sender SẼ nhận lại tin nhắn qua websocket. Ta KHÔNG CẦN setMessages thủ công ở đây để tránh trùng.
        
        // CHỈ CẦN gọi callback để update ChatList bên ngoài (để dòng lastMessage nhảy lên đầu)
        onMessageSent(activeChat.id, newMessage);
        
        setNewMessage('');
        setShowEmojiPicker(false);
    } catch (e) {
        console.error("Gửi tin nhắn thất bại", e);
        alert("Gửi lỗi: " + e);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header */}
      <header className="flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <img src={getAvatarUrl(activeChat.otherParticipantFullName)} alt="" className="h-10 w-10 rounded-full" />
            {/* Online status: Backend chưa có signalR presence, tạm ẩn */}
            {/* <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span> */}
          </div>
          <div>
            <h3 className="font-semibold">{activeChat.otherParticipantFullName}</h3>
            <p className="text-xs text-gray-500">{activeChat.otherParticipantHeadline}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><Phone size={20} /></button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><Video size={20} /></button>
          <button onClick={onToggleDetails} className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><Info size={20} /></button>
        </div>
      </header>

      {/* 2. Khung chat */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-slate-50">
        {isLoading ? (
             <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-blue-500"/></div>
        ) : (
            messages.map((msg, index) => {
            const isMine = msg.senderId === currentUser.id;
            // Logic "giấu" avatar
            const showAvatar = !isMine && (index === 0 || messages[index-1].senderId !== msg.senderId);
            return <MessageBubble key={msg.id} msg={msg} isMine={isMine} showAvatar={showAvatar} senderName={msg.senderFullName} />;
            })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Footer (Input) */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mb-2 flex space-x-1"
            >
              {EMOJIS.map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => setNewMessage(prev => prev + emoji)}
                  className="text-2xl rounded-full p-1 hover:bg-gray-200"
                >{emoji}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><PlusCircle size={20} /></button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><Image size={20} /></button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100"><Paperclip size={20} /></button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Aa"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button 
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-gray-200"
            >
              <Smile size={18} />
            </button>
          </div>

          <button onClick={handleSendMessage} className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;