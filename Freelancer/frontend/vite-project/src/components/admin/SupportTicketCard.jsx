import React from 'react';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Check, 
  LifeBuoy,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

/**
 * Đây là "Card" (Card) "Chi tiết" (Detail) "để" (to) "Admin" (Admin) "xem" (review) "và" (and) "Xử lý" (Resolve) "Ticket" (Ticket) "Hỗ trợ" (Support)
 * @param {object} props
 * @param {object} props.ticket - "Data" (Data) "của" (of) "cái" (the) "ticket" (ticket) "đang" (being) "chờ" (pending) "xử lý" (process)
 * @param {function} props.onResolve - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Đã xử lý" (Resolved)
 */
const SupportTicketCard = ({ ticket, onResolve }) => {

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "click" (click) "Nhắn tin" (Message) (Ý "tưởng" (idea) "của" (of) "bạn" (you))
  const handleMessageUser = () => {
    console.log(`ĐANG MỞ KHUNG CHAT VỚI: ${ticket.hrEmail}`);
    // (Sau "này" (later) "sẽ" (will) "tích hợp" (integrate) "logic" (logic) "mở" (open) "thẳng" (straight) "qua" (to) "trang" (page) "Tin nhắn" (Messages) "của" (of) "Admin" (Admin))
    alert(`Đã mở khung chat (giả lập) với ${ticket.hrEmail}`);
  };

  return (
    <>
      {/* "CARD" (CARD) "CHI TIẾT" (DETAIL) "CHÍNH" (MAIN) */}
      <div className="rounded-xl bg-white shadow-lg h-full">
        {/* Header "Card" (Card) */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Yêu cầu Hỗ trợ</h2>
        </div>

        {/* "Thân" (Body) "Card" (Card) (Scrollable) */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
          
          {/* Nhóm 1: "Chủ đề" (Topic) "GẤP" (URGENT) */}
          <section>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 uppercase">
                {ticket.topic}
              </span>
              <span className="text-sm text-gray-500">
                (Từ: {ticket.submittedAt})
              </span>
            </div>
          </section>

          {/* Nhóm 2: "Nội dung" (Message) "Yêu cầu" (Request) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <AlertCircle size={18} /> Nội dung Yêu cầu
            </h3>
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-gray-800 whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>
          </section>

          {/* Nhóm 3: Thông tin "Người Gửi" (Sender) (HR & Công ty) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User size={18} /> Thông tin Người Gửi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<Building size={16}/>} label="Công ty" value={ticket.companyName} />
              <InfoItem icon={<User size={16}/>} label="Người liên hệ (HR)" value={ticket.hrName} />
              <InfoItem icon={<Mail size={16}/>} label="Email HR" value={ticket.hrEmail} />
              <InfoItem icon={<Phone size={16}/>} label="SĐT HR" value={ticket.hrPhone} />
            </div>
          </section>
        </div>

        {/* "Footer" (Footer) "Card" (Card) (Nút "Hành động" (Action) "y" (just) "như" (as) "bạn" (you) "nói" (said)) */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t flex justify-end space-x-3">
          
          {/* "Nút" (Button) "Gọi" (Call) "Thẳng" (Directly) */}
          <a
            href={`tel:${ticket.hrPhone}`}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-green-700"
          >
            <Phone size={18} />
            Gọi Ngay
          </a>
          
          {/* "Nút" (Button) "Nhắn tin" (Message) (Mở "ra" (out) "app" (app) "chat" (chat)) */}
          <button
            onClick={handleMessageUser}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-blue-700"
          >
            <MessageSquare size={18} />
            Nhắn tin (Chat)
          </button>
          
          {/* "Nút" (Button) "Đánh dấu" (Mark) "đã" (as) "xong" (resolved) */}
          <button
            onClick={() => onResolve(ticket.id)} 
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-gray-700"
          >
            <Check size={18} />
            Đánh dấu Đã xử lý
          </button>
        </div>
      </div>
    </>
  );
};

// "Linh kiện" (Component) "con" (child) "cho" (for) "nó" (it) "sạch" (clean) "code" (code)
const InfoItem = ({ label, value, icon }) => (
  <div className="rounded-lg bg-gray-100 p-3 border">
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <p className="text-sm font-medium text-gray-900 truncate">
      {icon} {value}
    </p>
  </div>
);

export default SupportTicketCard;