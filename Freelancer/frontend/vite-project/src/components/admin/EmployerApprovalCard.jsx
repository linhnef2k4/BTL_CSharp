import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, Globe, User, Check, X, AlertTriangle, 
  Hash, MapPin, Users, Loader2, ExternalLink
} from 'lucide-react';

const InfoItem = ({ label, value, isLink = false, href = '#', icon }) => (
  <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
       {icon} {label}
    </div>
    {isLink ? (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-medium truncate block flex items-center gap-1"
      >
        {value} <ExternalLink size={12}/>
      </a>
    ) : (
      <p className="font-medium text-gray-800 truncate">{value || "Chưa cập nhật"}</p>
    )}
  </div>
);

const EmployerApprovalCard = ({ employer, onApprove, onReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    onReject(employer.id, rejectReason);
    setIsModalOpen(false);
    setRejectReason('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
        {/* Header Detail */}
        <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{employer.companyName}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {employer.address}</span>
                        <span className="flex items-center gap-1"><Users size={14}/> {employer.companySize} nhân viên</span>
                    </div>
                </div>
                {/* Status Badge (Luôn là Pending ở trang này) */}
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase border border-yellow-200">
                    Chờ duyệt
                </span>
            </div>
        </div>

        {/* Body Info */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-gray-50/50">
            {/* Section 1: Công ty */}
            <section>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                    Thông tin Doanh nghiệp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Mã số thuế" value={employer.taxCode} icon={<Hash size={14}/>} />
                    <InfoItem label="Website" value={employer.companyWebsite} isLink={true} href={employer.companyWebsite} icon={<Globe size={14}/>} />
                    {/* Thêm các trường khác nếu DTO có */}
                </div>
            </section>

            {/* Section 2: Người đại diện */}
            <section>
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2 border-l-4 border-green-500 pl-3">
                    Người đại diện (HR)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Họ và tên" value={employer.fullName} icon={<User size={14}/>} />
                    <InfoItem label="Email đăng nhập" value={employer.email} icon={<Globe size={14}/>} />
                    {/* SĐT chưa có trong DTO GetPending, nếu cần bạn phải update backend */}
                </div>
            </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-100"
            >
                <X size={18} /> Từ chối
            </button>
            <button
                onClick={() => onApprove(employer.id)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition transform active:scale-95"
            >
                <Check size={18} /> Duyệt yêu cầu
            </button>
        </div>

        {/* Modal Từ chối */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-5 border-b bg-red-50 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full text-red-600"><AlertTriangle size={24}/></div>
                            <h3 className="text-lg font-bold text-red-800">Từ chối yêu cầu?</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-600 mb-4 text-sm">
                                Bạn có chắc chắn muốn từ chối <strong>{employer.companyName}</strong>? <br/>
                                Hành động này sẽ cập nhật trạng thái hồ sơ thành "Rejected".
                            </p>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do từ chối (Bắt buộc)</label>
                            <textarea 
                                rows={3}
                                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none border-gray-300"
                                placeholder="VD: Thông tin MST không chính xác..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Hủy bỏ</button>
                            <button 
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Xác nhận Từ chối
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default EmployerApprovalCard;