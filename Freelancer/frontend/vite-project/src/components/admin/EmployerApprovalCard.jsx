import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Hash, 
  Globe, 
  Users, 
  User, 
  Mail, 
  Phone, 
  Check, 
  X, 
  AlertTriangle 
} from 'lucide-react';

/**
 * Đây là "Card" (Card) "Chi tiết" (Detail) "để" (to) "Admin" (Admin) "xem" (review) "và" (and) "Duyệt/Từ chối" (Approve/Reject)
 * @param {object} props
 * @param {object} props.employer - "Data" (Data) "của" (of) "công ty" (company) "đang" (being) "chờ" (pending) "duyệt" (review)
 * @param {function} props.onApprove - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Duyệt" (Approve)
 * @param {function} props.onReject - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Từ chối" (Reject) (sau "khi" (after) "nhập" (input) "lý do" (reason))
 */
const EmployerApprovalCard = ({ employer, onApprove, onReject }) => {
  // "State" (State) "nội bộ" (internal) "cho" (for) "cái" (the) "Modal" (Modal) "Từ chối" (Reject)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Từ chối" (Reject) "cuối cùng" (final)
  const handleRejectSubmit = () => {
    if (!rejectReason) {
      alert('Vui lòng nhập lý do từ chối.'); // "Sẽ" (Will) "thay" (replace) "bằng" (with) "toast" (toast) "sau" (later)
      return;
    }
    onReject(employer.id, rejectReason); // "Gọi" (Call) "hàm" (function) "của" (of) "cha" (parent) "với" (with) "lý do" (reason)
    setIsModalOpen(false);
    setRejectReason('');
  };

  // "Animation" (Animation) "cho" (for) "Modal" (Modal)
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <>
      {/* "CARD" (CARD) "CHI TIẾT" (DETAIL) "CHÍNH" (MAIN) */}
      <div className="rounded-xl bg-white shadow-lg h-full">
        {/* Header "Card" (Card) */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Đơn Đăng ký</h2>
          <p className="text-sm text-gray-500">
            Hãy xem xét kỹ thông tin trước khi Duyệt hoặc Từ chối.
          </p>
        </div>

        {/* "Thân" (Body) "Card" (Card) (Scrollable) */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
          
          {/* Nhóm 1: Thông tin "Công ty" (Company) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Building size={18} /> Thông tin Công ty
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Tên Công ty" value={employer.companyName} />
              <InfoItem label="Mã Số Thuế (MST)" value={employer.taxCode} isHighlight={true} />
              <InfoItem label="Website" value={employer.website} isLink={true} />
              <InfoItem label="Quy mô" value={employer.companySize} />
            </div>
          </section>

          {/* Nhóm 2: Thông tin "Người Liên hệ" (HR) (HR) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User size={18} /> Thông tin Người Liên hệ (HR)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Họ tên HR" value={employer.hrName} />
              <InfoItem label="Chức vụ" value={employer.hrTitle} />
              <InfoItem label="Email HR" value={employer.hrEmail} isLink={true} href={`mailto:${employer.hrEmail}`} />
              <InfoItem label="SĐT HR" value={employer.hrPhone} isLink={true} href={`tel:${employer.hrPhone}`} />
            </div>
          </section>

        </div>

        {/* "Footer" (Footer) "Card" (Card) (Nút "Hành động" (Action)) */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(true)} // <-- "MỞ" (OPEN) "MODAL" (MODAL) "NHẬP" (INPUT) "LÝ DO" (REASON)
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-red-700"
          >
            <X size={18} />
            Từ chối
          </button>
          <button
            onClick={() => onApprove(employer.id)} // <-- "GỌI" (CALL) "HÀM" (FUNCTION) "DUYỆT" (APPROVE) "CỦA" (OF) "CHA" (PARENT)
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-green-700"
          >
            <Check size={18} />
            Duyệt
          </button>
        </div>
      </div>

      {/* --- "MODAL" (MODAL) "TỪ CHỐI" (REJECT) (Full "Logic") --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)} 
          >
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-lg rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Header "Modal" (Modal) */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle />
                  Xác nhận Từ chối Employer?
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* "Nội dung" (Body) "Modal" (Modal) (CHỨA "FORM" (FORM)) */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Bạn sắp từ chối: <span className="font-bold">{employer.companyName}</span>
                </p>
                
                {/* "Form" (Form) "Nhập" (Input) "Lý do" (Reason) (BẮT BUỘC) (MANDATORY) */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
                    Lý do Từ chối (Bắt buộc): *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="VD: Mã số thuế không hợp lệ, thông tin không rõ ràng..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* "Nút" (Buttons) "Hủy" (Cancel) "và" (and) "Xác nhận" (Confirm) "Từ chối" (Reject) */}
              <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800
                             hover:bg-gray-300"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit} // <-- "GỌI" (CALL) "HÀM" (FUNCTION) "XỬ LÝ" (HANDLE) "SUBMIT" (SUBMIT)
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700
                             disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!rejectReason} // "Không" (Don't) "cho" (let) "bấm" (click) "nếu" (if) "chưa" (not yet) "nhập" (input) "lý do" (reason)
                >
                  <ShieldOff size={16} />
                  Xác nhận Từ chối
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- HẾT "MODAL" (MODAL) --- */}
    </>
  );
};

// "Linh kiện" (Component) "con" (child) "cho" (for) "nó" (it) "sạch" (clean) "code" (code)
const InfoItem = ({ label, value, isLink = false, href = '#', isHighlight = false }) => (
  <div className="rounded-lg bg-gray-50 p-3 border">
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    {isLink ? (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block text-sm font-medium text-blue-600 truncate hover:underline"
      >
        {value}
      </a>
    ) : (
      <p className={`text-sm font-medium truncate ${isHighlight ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
        {value}
      </p>
    )}
  </div>
);

export default EmployerApprovalCard;