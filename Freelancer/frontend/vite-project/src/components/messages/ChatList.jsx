import React, { useState } from 'react';
import { Search, MoreHorizontal, Edit } from 'lucide-react';

// Helper để format thời gian
const formatTime = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if(date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
};

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${name?.replace(' ', '+')}&background=random&color=fff`;

// Component con cho 1 item trong danh bạ
const ChatListItem = ({ conversation, isActive, onSelect }) => (
  <li
    onClick={onSelect}
    className={`flex items-center space-x-3 rounded-lg p-2 cursor-pointer transition-colors duration-200
      ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}
    `}
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <img 
        src={getAvatarUrl(conversation.otherParticipantFullName)} 
        alt={conversation.otherParticipantFullName} 
        className="h-12 w-12 rounded-full" 
      />
      {/* Tạm thời chưa có status online thật, dùng mock logic hoặc ẩn */}
      {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span> */}
    </div>
    
    {/* Tên và tin nhắn cuối */}
    <div className="flex-1 overflow-hidden">
      <h4 className="font-semibold text-sm truncate">{conversation.otherParticipantFullName}</h4>
      <p className={`text-sm truncate ${conversation.isRead ? 'text-gray-500' : 'text-blue-600 font-semibold'}`}>
        {conversation.lastMessage || 'Bắt đầu trò chuyện'}
      </p>
    </div>
    
    {/* Thời gian */}
    <span className="text-xs text-gray-400 self-start pt-1">
        {formatTime(conversation.lastMessageDate)}
    </span>
  </li>
);

// Component con cho nút Filter
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200
      ${isActive
        ? 'bg-blue-100 text-blue-600'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
  >
    {label}
  </button>
);

// Component chính
const ChatList = ({ conversations, activeChat, onSelectChat }) => {
  const [filter, setFilter] = useState('Tất cả'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Logic Lọc Client-side
  const filteredConversations = conversations.filter(c => {
    const name = c.otherParticipantFullName || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'Chưa đọc') {
      matchesFilter = c.isRead === false;
    }
    // Filter 'Nhóm' chưa hỗ trợ do DTO chưa có field isGroup
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header */}
      <header className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Đoạn chat</h2>
        <div className="flex space-x-2">
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Edit size={20} />
          </button>
        </div>
      </header>

      {/* 2. Search & Filters */}
      <div className="flex-shrink-0 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <FilterButton label="Tất cả" isActive={filter === 'Tất cả'} onClick={() => setFilter('Tất cả')} />
          <FilterButton label="Chưa đọc" isActive={filter === 'Chưa đọc'} onClick={() => setFilter('Chưa đọc')} />
          <FilterButton label="Nhóm" isActive={filter === 'Nhóm'} onClick={() => setFilter('Nhóm')} />
        </div>
      </div>

      {/* 3. Danh sách (scrollable) */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2">
        {filteredConversations.map(conv => (
          <ChatListItem
            key={conv.id}
            conversation={conv}
            isActive={activeChat?.id === conv.id}
            onSelect={() => onSelectChat(conv)}
          />
        ))}
        {filteredConversations.length === 0 && (
            <div className="text-center text-gray-500 mt-4 text-sm">Không tìm thấy cuộc trò chuyện.</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;