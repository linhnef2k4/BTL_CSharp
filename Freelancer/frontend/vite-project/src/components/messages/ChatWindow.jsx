import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, PlusCircle, Image, Paperclip, Smile, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Dữ liệu "giả" cho tin nhắn
const MOCK_MESSAGES = [
  { id: 1, sender: 'other', text: 'Báo nó gửi file đi...', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, sender: 'me', text: 'Oke bạn ơi' },
  { id: 3, sender: 'other', text: 'Gửi gấp nhé!', avatar: 'https://i.pravatar.cc/150?img=1' },
];
// Emoji "tượng trưng"
const EMOJIS = ['😀', '😂', '😍', '👍', '❤️'];

// Component con cho 1 tin nhắn
const MessageBubble = ({ msg, isMine, showAvatar }) => (
  <div className={`flex items-end ${isMine ? 'flex-row-reverse' : 'space-x-2'}`}>
    {!isMine && (
      <img 
        src={showAvatar ? msg.avatar : ''} 
        alt="" 
        className={`h-7 w-7 rounded-full ${showAvatar ? '' : 'invisible'}`} 
      />
    )}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`max-w-xs rounded-2xl px-3 py-2 text-sm lg:max-w-md
        ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
      `}
    >
      {msg.text}
    </motion.div>
  </div>
);

// Component chính
const ChatWindow = ({ activeUser, onToggleDetails }) => {
  // State nội bộ
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Ref để auto-scroll
  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll khi tin nhắn thay đổi hoặc đổi chat
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeUser]);

  // Reset chat khi đổi người
  useEffect(() => {
    setMessages(MOCK_MESSAGES); // Load chat "giả"
    setNewMessage('');
    setShowEmojiPicker(false);
  }, [activeUser]);


  // Hàm gửi tin nhắn (full logic)
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const msg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
    };
    
    setMessages([...messages, msg]); // Thêm tin nhắn mới
    setNewMessage(''); // Xóa input
    setShowEmojiPicker(false); // Đóng emoji
  };

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header (y hệt ảnh) */}
      <header className="flex flex-shrink-0 items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <img src={activeUser.avatar} alt={activeUser.name} className="h-10 w-10 rounded-full" />
            {activeUser.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{activeUser.name}</h3>
            <p className="text-xs text-gray-500">{activeUser.status}</p>
          </div>
        </div>
        
        {/* Nút chức năng header */}
        <div className="flex space-x-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Phone size={20} />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Video size={20} />
          </button>
          <button 
            onClick={onToggleDetails} // <-- Kích hoạt cột phải
            className="rounded-full p-2 text-blue-600 hover:bg-gray-100"
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* 2. Khung chat (scrollable) */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isMine = msg.sender === 'me';
          // Logic "giấu" avatar nếu người gửi giống tin nhắn trước
          const showAvatar = !isMine && (index === 0 || messages[index-1].sender !== msg.sender);
          return <MessageBubble key={msg.id} msg={msg} isMine={isMine} showAvatar={showAvatar} />;
        })}
        {/* Điểm neo để auto-scroll */}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Footer (Input) "Full chức năng" */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-200">
        {/* Emoji Picker "Tượng trưng" */}
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
          {/* Nút chức năng (y hệt ảnh, click được) */}
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <PlusCircle size={20} />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Image size={20} />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Paperclip size={20} />
          </button>
          
          {/* Input chính */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Aa"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-10 text-sm focus:outline-none"
            />
            <button 
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-gray-200"
            >
              <Smile size={18} />
            </button>
          </div>

          {/* Nút Gửi */}
          <button 
            onClick={handleSendMessage}
            className="rounded-full p-2 text-blue-600 hover:bg-gray-100"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;