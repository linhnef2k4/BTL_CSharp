import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  Clock,
  Check, 
  X, 
  AlertTriangle,
  FileText,
  Award,
  ListChecks
} from 'lucide-react';

/**
 * Đây là "Card" (Card) "Chi tiết" (Detail) "để" (to) "Admin" (Admin) "xem" (review) "và" (and) "Duyệt/Từ chối" (Approve/Reject) "JOB" (JOB)
 * @param {object} props
 * @param {object} props.job - "Data" (Data) "của" (of) "cái" (the) "job" (job) "đang" (being) "chờ" (pending) "duyệt" (review)
 * @param {function} props.onApprove - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Duyệt" (Approve)
 * @param {function} props.onReject - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Từ chối" (Reject) (sau "khi" (after) "nhập" (input) "lý do" (reason))
 */
const JobApprovalCard = ({ job, onApprove, onReject }) => {
  // "State" (State) "nội bộ" (internal) "cho" (for) "cái" (the) "Modal" (Modal) "Từ chối" (Reject)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Từ chối" (Reject) "cuối cùng" (final)
  const handleRejectSubmit = () => {
    if (!rejectReason) {
      alert('Vui lòng nhập lý do từ chối.'); 
      return;
    }
    onReject(job.id, rejectReason); 
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
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Job Đăng</h2>
          <p className="text-sm text-gray-500">
            Kiểm tra "từ khóa" (keywords) "cấm" (forbidden) "và" (and) "tính" (authenticity) "xác thực" (authentic) "trước" (before) "khi" (when) "Duyệt" (Approve).
          </p>
        </div>

        {/* "Thân" (Body) "Card" (Card) (Scrollable) */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
          
          {/* Nhóm 1: Thông tin "Cơ bản" (Basic) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Building size={18} /> {job.companyName}
            </h3>
            <p className="text-2xl font-bold text-blue-600">{job.title}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              <InfoItem icon={<MapPin size={16} />} label="Địa điểm" value={job.location} />
              <InfoItem icon={<DollarSign size={16} />} label="Mức lương" value={job.salary} />
              <InfoItem icon={<BarChart3 size={16} />} label="Cấp bậc" value={job.level} />
              <InfoItem icon={<Clock size={16} />} label="Hình thức" value={job.type} />
            </div>
          </section>

          {/* Nhóm 2: "Chi tiết" (Details) "Mô tả" (Description) (Dùng "details" (details) "cho" (to be) "nó" (it) "gọn" (clean)) */}
          <section className="space-y-2">
            <DetailSection title="Mô tả Công việc" icon={<FileText size={16} />}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
            </DetailSection>

            <DetailSection title="Yêu cầu Ứng viên" icon={<ListChecks size={16} />}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </DetailSection>

            <DetailSection title="Quyền lợi" icon={<Award size={16} />}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.benefits }} />
            </DetailSection>
          </section>

          {/* Nhóm 3: "Kỹ năng" (Skills) */}
          <section>
            <h4 className="text-sm font-semibold text-gray-400 mb-1">KỸ NĂNG YÊU CẦU</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

        </div>

        {/* "Footer" (Footer) "Card" (Card) (Nút "Hành động" (Action)) */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-red-700"
          >
            <X size={18} />
            Từ chối
          </button>
          <button
            onClick={() => onApprove(job.id)} 
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-green-700"
          >
            <Check size={18} />
            Duyệt Job
          </button>
        </div>
      </div>

      {/* --- "MODAL" (MODAL) "TỪ CHỐI" (REJECT) (Copy "y hệt" (exact copy) "từ" (from) "file" (file) "trước" (previous)) --- */}
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
                  Xác nhận Từ chối Job?
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
                  Bạn sắp từ chối: <span className="font-bold">{job.title}</span> của <span className="font-bold">{job.companyName}</span>
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
                    placeholder="VD: Vi phạm từ khóa, nội dung không phù hợp..."
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
                  onClick={handleRejectSubmit} 
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700
                             disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!rejectReason} 
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
// 1. "Item" (Item) "Thông tin" (Info) "Cơ bản" (Basic)
const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-center space-x-1.5 text-sm text-gray-600">
    <span className="text-gray-400">{icon}</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

// 2. "Section" (Section) "Mô tả" (Description) (Dùng "details" (details) "để" (to) "đóng/mở" (toggle))
const DetailSection = ({ title, icon, children }) => (
  <details className="group rounded-lg border bg-gray-50" open>
    <summary className="flex cursor-pointer items-center gap-2 p-3 font-semibold text-gray-800 hover:bg-gray-100">
      {icon}
      {title}
    </summary>
    <div className="p-3 border-t bg-white">
      {children}
    </div>
  </details>
);

export default JobApprovalCard;