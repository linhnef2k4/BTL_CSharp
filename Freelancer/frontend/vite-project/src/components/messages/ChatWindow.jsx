import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, Video, MoreVertical, Image as ImageIcon, 
  Paperclip, Send, ArrowLeft, Loader2, FileText, Download, ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../services/api';
import { getAvatarUrl } from '../../utils/imageUrl';

const ChatWindow = ({ chat, messages, currentUser, connection, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lấy thông tin người chat cùng
  const chatName = chat.otherParticipantFullName || "Người dùng";
  const chatAvatar = getAvatarUrl(chat.otherParticipantAvatar, chatName);

  // --- GỬI TIN NHẮN VĂN BẢN ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connection) return;

    try {
      // Gửi Text: type = "Text"
      await connection.invoke("SendMessage", chat.id, newMessage, "Text");
      setNewMessage(''); 
    } catch (error) {
      console.error("Gửi tin thất bại:", error);
    }
  };

  // --- GỬI FILE / ẢNH ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    // Kiểm tra loại file để set MessageType cho đúng với Enum Backend
    const isImageFile = file.type.startsWith('image/');
    const messageType = isImageFile ? "Image" : "File";

    try {
      // 1. Upload lên API
      const res = await api.post('/upload/chat-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = res.data.Url || res.data.url;
      
      if (connection) {
         // 2. Gửi tin nhắn qua SignalR kèm URL và Type
         await connection.invoke("SendMessage", chat.id, fileUrl, messageType); 
      }
    } catch (error) {
      alert("Lỗi tải file. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- FORMAT THỜI GIAN (Xử lý UTC) ---
  const formatTime = (dateString) => {
      if (!dateString) return "";
      // Thêm 'Z' vào cuối chuỗi thời gian nếu thiếu để đảm bảo đây là giờ UTC
      // (Backend thường trả về múi giờ UTC nhưng đôi khi thiếu 'Z')
      const dateStr = dateString.endsWith('Z') ? dateString : dateString + 'Z';
      try {
          // Trình duyệt sẽ tự convert UTC sang giờ Local (Việt Nam)
          return format(new Date(dateStr), 'HH:mm');
      } catch { return ""; }
  };

  // --- COMPONENT CON: HIỂN THỊ NỘI DUNG TIN NHẮN ---
  const MessageContent = ({ msg, isMe }) => {
    // Chuẩn hóa type về chữ thường để so sánh
    // Backend có thể trả về "Image", "image", "File", "file"...
    const type = (msg.type || msg.Type || "Text").toLowerCase();
    const content = msg.content || "";

    // CASE 1: NẾU LÀ ẢNH
    // Kiểm tra type là image HOẶC đuôi file là ảnh (fallback)
    const isImageLink = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(content);
    if (type === 'image' || (type === 'text' && isImageLink && content.startsWith('http'))) {
        return (
            <div className="mt-1 relative group">
                <img 
                    src={getAvatarUrl(content)} 
                    alt="Sent image" 
                    className="rounded-xl max-w-full w-auto max-h-[300px] object-cover cursor-pointer border border-gray-200 shadow-sm hover:opacity-95 transition-opacity"
                    onClick={() => window.open(getAvatarUrl(content), '_blank')}
                />
            </div>
        );
    }

    // CASE 2: NẾU LÀ FILE
    // Kiểm tra type là file HOẶC nội dung là link file (fallback)
    const isFileLink = content.startsWith('http') || content.includes('/uploads/');
    if (type === 'file' || (type === 'text' && isFileLink && !isImageLink)) {
        const fileName = content.split('/').pop() || "Tập tin đính kèm";
        return (
            <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm max-w-[280px] ${isMe ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className="bg-gray-100 p-2.5 rounded-lg flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden mr-2">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={fileName}>
                        {fileName}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Nhấn để tải về</p>
                </div>
                <a 
                    href={getAvatarUrl(content)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                    title="Tải xuống"
                >
                    <Download className="w-5 h-5 text-gray-600" />
                </a>
            </div>
        );
    }

    // CASE 3: NẾU LÀ TEXT THƯỜNG
    return (
        <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
            isMe 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
        }`}>
            {content}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6]">
      {/* HEADER */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-4">
          {/* Nút Back cho Mobile */}
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <img 
              src={chatAvatar} 
              alt={chatName} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={(e) => e.target.src = getAvatarUrl(null, chatName)}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full ring-1 ring-white"></span>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">{chatName}</h3>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Đang hoạt động
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all"><Phone className="w-5 h-5" /></button>
          <button className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all"><Video className="w-5 h-5" /></button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* MESSAGE LIST (SCROLLABLE AREA) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                
                {/* Avatar người khác (chỉ hiện nếu không phải tin nhắn của mình) */}
                {!isMe && (
                  <img 
                    src={chatAvatar} 
                    alt="Ava" 
                    className="w-8 h-8 rounded-full object-cover self-end mb-1 shadow-sm border border-white"
                    onError={(e) => e.target.src = getAvatarUrl(null, chatName)}
                  />
                )}
                
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                   {/* Nội dung tin nhắn (Component tách riêng ở trên) */}
                   <MessageContent msg={msg} isMe={isMe} />
                   
                   {/* Thời gian gửi */}
                   <span className="text-[10px] text-gray-400 mt-1 px-1 select-none">
                     {formatTime(msg.sentDate || msg.SentDate)}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
        {/* Element dùng để scroll xuống đáy */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FOOTER */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-lg z-20">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-3">
          {/* Input File Ẩn */}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          
          {/* Nút Đính kèm (Chung cho File & Ảnh) */}
          <button 
             type="button"
             onClick={() => fileInputRef.current?.click()} 
             className="mb-1 p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
             disabled={isUploading}
             title="Đính kèm tập tin hoặc ảnh"
          >
             {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <Paperclip className="w-6 h-6" />}
          </button>

          {/* Nút Gửi Ảnh Nhanh (Tùy chọn) */}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mb-1 p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors md:block hidden" title="Gửi ảnh">
            <ImageIcon className="w-6 h-6" />
          </button>

          {/* Ô Nhập liệu */}
          <div className="flex-1 bg-gray-100 rounded-[24px] flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-400">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-800 placeholder-gray-500 py-1 max-h-32 overflow-y-auto"
            />
          </div>
          
          {/* Nút Gửi */}
          <button 
             type="submit"
             disabled={!newMessage.trim() || !connection}
             className="mb-1 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;