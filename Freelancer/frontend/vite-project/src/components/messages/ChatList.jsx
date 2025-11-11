import React, { useState } from 'react';
import { Search, MoreHorizontal, Edit } from 'lucide-react';

// Component con cho 1 item trong danh bạ
const ChatListItem = ({ contact, isActive, onSelect }) => (
  <li
    onClick={onSelect}
    className={`flex items-center space-x-3 rounded-lg p-2 cursor-pointer transition-colors duration-200
      ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}
    `}
  >
    {/* Avatar (với chấm online) */}
    <div className="relative flex-shrink-0">
      <img src={contact.avatar} alt={contact.name} className="h-12 w-12 rounded-full" />
      {contact.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
      )}
    </div>
    
    {/* Tên và tin nhắn cuối (truncate: ... nếu quá dài) */}
    <div className="flex-1 overflow-hidden">
      <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
    </div>
    
    {/* Thời gian */}
    <span className="text-xs text-gray-400 self-start pt-1">{contact.time}</span>
  </li>
);

// Component con cho nút Filter (Tất cả, Chưa đọc, Nhóm)
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
const ChatList = ({ contacts, activeChat, onSelectChat }) => {
  // State nội bộ để quản lý Filter và Search
  const [filter, setFilter] = useState('Tất cả'); // "Tất cả", "Chưa đọc", "Nhóm"
  const [searchTerm, setSearchTerm] = useState('');

  // Logic Lọc (y hệt ảnh)
  const filteredContacts = contacts.filter(c => {
    // 1. Lọc theo Search Term
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Lọc theo Tab Filter
    let matchesFilter = true;
    if (filter === 'Nhóm') {
      matchesFilter = c.isGroup;
    } else if (filter === 'Chưa đọc') {
      // (Logic giả lập, sau này bạn sẽ có data thật `c.unread`)
      matchesFilter = c.id === 3; // Giả lập 'KK oce' là chưa đọc
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header (y hệt ảnh) */}
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

      {/* 2. Search & Filters (y hệt ảnh) */}
      <div className="flex-shrink-0 p-4 space-y-3">
        {/* Search */}
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
        {/* Filters */}
        <div className="flex space-x-2">
          <FilterButton label="Tất cả" isActive={filter === 'Tất cả'} onClick={() => setFilter('Tất cả')} />
          <FilterButton label="Chưa đọc" isActive={filter === 'Chưa đọc'} onClick={() => setFilter('Chưa đọc')} />
          <FilterButton label="Nhóm" isActive={filter === 'Nhóm'} onClick={() => setFilter('Nhóm')} />
        </div>
      </div>

      {/* 3. Danh sách (scrollable) */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2">
        {filteredContacts.map(contact => (
          <ChatListItem
            key={contact.id}
            contact={contact}
            isActive={activeChat?.id === contact.id}
            onSelect={() => onSelectChat(contact)} // <-- Báo lên "bộ não"
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;