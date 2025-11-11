import React, { useState } from 'react';
import { Search, Inbox, MailWarning } from 'lucide-react'; // "Icon" (Icon) "cho" (for) "Filter" (Filter)

// --- Component "con" (child) "cho" (for) "1" (one) "item" (item) "trong" (in) "danh bạ" (list) ---
const EmployerChatListItem = ({ contact, isActive, onSelect }) => (
  <li
    onClick={onSelect}
    className={`flex items-start space-x-3 rounded-lg p-2 cursor-pointer transition-colors duration-200
      ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}
    `}
  >
    {/* Avatar (với "chấm" (dot) "online" (online)) */}
    <div className="relative flex-shrink-0">
      <img src={contact.avatar} alt={contact.name} className="h-12 w-12 rounded-full" />
      {contact.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
      )}
    </div>
    
    {/* Tên, "Tin nhắn" (Message) "cuối" (last), "và" (and) "Status" (Status) (MỚI) */}
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{contact.time}</span>
      </div>
      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
      {/* "Cái" (The) "tag" (tag) "status" (status) "xịn" (pro) "để" (to) "phân biệt" (differentiate) "chờ" (request) "hay" (or) "đã" (processed) "duyệt" (reviewed) */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
        contact.status.includes('chờ') 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {contact.status}
      </span>
    </div>
  </li>
);

// --- Component "con" (child) "cho" (for) "nút" (button) "Filter" (Filter) ---
const FilterButton = ({ label, icon, isActive, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
  >
    {icon}
    <span>{label}</span>
    {/* "Hiển thị" (Show) "số" (count) "lượng" (number) "tin" (messages) "chờ" (waiting) */}
    {count > 0 && (
      <span className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
        {count}
      </span>
    )}
  </button>
);

// --- Component "chính" (main) ---
const EmployerChatList = ({ 
  contacts,       // "Nhận" (Receives) "list" (list) "data" (data) "từ" (from) "cha" (parent) (File 1/3)
  activeChat,     // "Nhận" (Receives) "biết" (knows) "ai" (who) "đang" (is) "active" (active)
  onSelectChat,   // "Nhận" (Receives) "hàm" (function) "để" (to) "báo" (notify) "khi" (when) "click" (click) "chọn" (select)
  activeFilter,   // "Nhận" (Receives) "biết" (knows) "filter" (filter) "nào" (which) "đang" (is) "active" (active)
  onFilterChange  // "Nhận" (Receives) "hàm" (function) "để" (to) "báo" (notify) "khi" (when) "click" (click) "đổi" (change) "filter" (filter)
}) => {
  // "State" (State) "nội bộ" (internal) "cho" (for) "thanh" (bar) "search" (search)
  const [searchTerm, setSearchTerm] = useState('');

  // "Logic" (Logic) "Lọc" (Filter) "bằng" (by) "Search Term" (Search Term)
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // "Giả lập" (Mockup) "số" (count) "lượng" (number) "tin" (messages) "chờ" (waiting) (sau "này" (later) "sẽ" (will) "lấy" (get) "từ" (from) "API" (API))
  const requestCount = activeFilter === 'Hộp thư' ? 2 : 0; // "Giả lập" (Mockup) "có" (has) "2" (two) "tin" (messages) "chờ" (waiting) "mới" (new)

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header (y "hệt" (like) "ảnh" (image)) */}
      <header className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Tin nhắn</h2>
      </header>

      {/* 2. Search & Filters (ĐÃ "NÂNG CẤP" (UPGRADED) "LOGIC" (LOGIC) "TIN CHỜ" (MESSAGE REQUESTS)) */}
      <div className="flex-shrink-0 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trong Hộp thư..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Filters "MỚI" (NEW) */}
        <div className="flex space-x-2">
          <FilterButton 
            label="Hộp thư" 
            icon={<Inbox size={16} />}
            isActive={activeFilter === 'Hộp thư'} 
            onClick={() => onFilterChange('Hộp thư')}
            count={0}
          />
          <FilterButton 
            label="Tin nhắn chờ" 
            icon={<MailWarning size={16} />}
            isActive={activeFilter === 'Tin nhắn chờ'} 
            onClick={() => onFilterChange('Tin nhắn chờ')}
            count={requestCount} // <-- "Cái" (The) "này" (this) "là" (is) "mồi" (bait) "nè" (look)!
          />
        </div>
      </div>

      {/* 3. Danh sách (scrollable) */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <EmployerChatListItem
              key={contact.id}
              contact={contact}
              isActive={activeChat?.id === contact.id}
              onSelect={() => onSelectChat(contact)} // <-- "Báo" (Notify) "lên" (up) "bộ não" (brain)
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 p-4">
            Không tìm thấy liên hệ.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployerChatList;