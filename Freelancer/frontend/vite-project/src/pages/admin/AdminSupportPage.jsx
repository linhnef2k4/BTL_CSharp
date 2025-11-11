import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// "IMPORT" (IMPORT) "CÁI" (THE) "CARD" (CARD) "CHI TIẾT" (DETAIL) "TA" (WE) "VỪA" (JUST) "LÀM" (BUILT) (FILE 1/3)
import SupportTicketCard from '../../components/admin/SupportTicketCard'; 
import { User, Clock, Search, LifeBuoy } from 'lucide-react';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
// (Đây "là" (is) "data" (data) "lấy" (taken) "từ" (from) "cái" (the) "form" (form) `SupportPage.jsx` "của" (of) "Employer" (Employer) "gửi" (sent) "lên" (up))
const MOCK_PENDING_TICKETS = [
  { 
    id: 't1', 
    topic: 'Báo lỗi kỹ thuật',
    message: 'Tôi không thể đăng nhập vào tài khoản Employer của mình. Hệ thống cứ báo lỗi 500. Vui lòng kiểm tra gấp!\n\nID Công ty: 0123456789',
    companyName: 'FPT Software',
    hrName: 'Trần Văn A', 
    hrEmail: 'a.tran@fpt.com', 
    hrPhone: '0901234567',
    submittedAt: '15 phút trước'
  },
  { 
    id: 't2', 
    topic: 'Hỏi về Gói VIP',
    message: 'Tôi muốn xuất hóa đơn VAT cho gói VIP tháng 10. Email của tôi là b.nguyen@xyz-group.com. MST: 9876543210',
    companyName: 'Tập đoàn XYZ',
    hrName: 'Nguyễn Thị B', 
    hrEmail: 'b.nguyen@xyz-group.com', 
    hrPhone: '0912345678',
    submittedAt: '1 giờ trước'
  },
];
// ------------------------------------

// --- "Component" (Component) "con" (child) "cho" (for) "CỘT TRÁI" (LEFT COLUMN) ---
// "Đây" (This) "là" (is) "1" (one) "cái" (a) "item" (item) "trong" (in) "list" (list) "chờ" (pending)
const PendingItem = ({ ticket, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-3 rounded-lg border-b
                transition-colors duration-200
                ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
  >
    <div className="flex items-center justify-between">
      {/* "Hiển thị" (Show) "Chủ đề" (Topic) "của" (of) "ticket" (ticket) */}
      <h4 className="font-semibold text-sm text-gray-900 truncate">{ticket.topic}</h4>
      <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
        {ticket.submittedAt}
      </span>
    </div>
    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
      <User size={14} /> {ticket.hrName} ({ticket.companyName})
    </p>
  </button>
);
// ------------------------------------

const AdminSupportPage = () => {
  // --- "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS) ---
  const [pendingTickets, setPendingTickets] = useState(MOCK_PENDING_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState(MOCK_PENDING_TICKETS[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "Lọc" (Filter) "bằng" (by) "Search" (Search)
  const filteredList = pendingTickets.filter(ticket =>
    ticket.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.hrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // "Tìm" (Find) "ra" (out) "data" (data) "của" (of) "thằng" (guy) "đang" (being) "được" (selected) "chọn" (selected)
  const selectedTicket = pendingTickets.find(ticket => ticket.id === selectedTicketId);

  // --- "LOGIC" (LOGIC) "XỬ LÝ" (RESOLVE) ---
  
  const handleResolve = (ticketId) => {
    console.log(`ĐÃ XỬ LÝ Ticket ID: ${ticketId}`);
    // (Sau "này" (later) "gọi" (call) "API" (API) "để" (to) "chuyển" (move) "status" (status) "ở" (at) "đây" (here))
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingTickets.filter(ticket => ticket.id !== ticketId);
    setPendingTickets(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedTicketId(newList[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Quản lý Hỗ trợ</h1>
      
      {/* "LAYOUT" (LAYOUT) "2" (TWO) "CỘT" (COLUMNS) "CHIA" (SPLIT) "MÀN HÌNH" (SCREEN) */}
      {/* "Tái" (Re-) "sử dụng" (use) "layout" (layout) "y hệt" (exactly like) "trang" (page) "Duyệt Employer" (Approve Employer) */}
      <div className="flex h-[calc(100vh-12rem)] rounded-xl bg-white shadow-lg overflow-hidden">
        
        {/* CỘT 1: "DANH SÁCH" (LIST) "TICKET" (TICKET) "CHỜ" (PENDING) (BÊN TRÁI) */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* "Header" (Header) "Cột 1" (Column 1) (Search) */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={18} />
              Đang chờ xử lý ({filteredList.length})
            </h3>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo Chủ đề, Tên, Công ty..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* "List" (List) "Cột 1" (Column 1) (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map(ticket => (
                <PendingItem
                  key={ticket.id}
                  ticket={ticket}
                  isActive={selectedTicketId === ticket.id}
                  onSelect={() => setSelectedTicketId(ticket.id)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 p-4">
                {searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Ticket nào chờ xử lý.'}
              </p>
            )}
          </div>
        </div>

        {/* CỘT 2: "CHI TIẾT" (DETAIL) "TICKET" (TICKET) (BÊN PHẢI) */}
        <div className="w-2/3">
          <AnimatePresence mode="wait">
            {selectedTicket ? (
              // "NẾU" (IF) "CÓ" (HAVE) "TICKET" (TICKET) "ĐANG" (BEING) "CHỌN" (SELECTED), "GỌI" (CALL) "FILE 1/3" (FILE 1/3)
              <motion.div
                key={selectedTicket.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SupportTicketCard 
                  ticket={selectedTicket}
                  onResolve={handleResolve} // "Truyền" (Pass) "hàm" (function) "Xử lý" (Resolve) "xuống" (down)
                />
              </motion.div>
            ) : (
              // "NẾU" (IF) "KHÔNG CÓ" (HAVE NO) "AI" (ANYONE) "TRONG" (IN) "LIST" (LIST) "ĐỂ" (TO) "CHỌN" (SELECT)
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <LifeBuoy size={40} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    {pendingTickets.length > 0 
                      ? "Chọn một Ticket để xem chi tiết" 
                      : (searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Ticket nào chờ xử lý.')
                    }
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;