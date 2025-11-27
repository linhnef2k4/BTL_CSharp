import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, MapPin, DollarSign, BarChart3, Clock,
  Check, X, AlertTriangle, FileText, Award, ListChecks, Loader2
} from 'lucide-react';
import adminService from '../../../services/adminService';
import { formatSalary } from '../../utils/formatUtils';

// Component Info Item
const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-center space-x-2 text-sm p-2 bg-gray-50 rounded-lg border border-gray-100">
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    <span className="font-medium text-gray-800 truncate" title={value}>{value}</span>
  </div>
);

// Component Detail Section
const DetailSection = ({ title, icon, content }) => (
  <div className="border rounded-xl overflow-hidden border-gray-200">
    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2 font-semibold text-gray-700 text-sm">
       {icon} {title}
    </div>
    <div className="p-4 bg-white text-sm text-gray-600 leading-relaxed whitespace-pre-line">
       {content || "Không có thông tin."}
    </div>
  </div>
);

const JobApprovalCard = ({ jobId, initialData, onApprove, onReject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // State chứa thông tin chi tiết (Full description...)
  const [jobDetail, setJobDetail] = useState(initialData);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load chi tiết khi ID thay đổi
  useEffect(() => {
    const fetchDetail = async () => {
       setLoadingDetail(true);
       try {
           // Gọi API lấy chi tiết Job để xem Description, Requirements...
           const res = await adminService.getProjectDetail(jobId);
           setJobDetail(res.data);
       } catch (error) {
           console.error("Lỗi tải chi tiết job:", error);
       } finally {
           setLoadingDetail(false);
       }
    };
    if (jobId) fetchDetail();
  }, [jobId]);

  const handleRejectSubmit = () => {
    if (!rejectReason) return alert('Vui lòng nhập lý do từ chối.');
    onReject(jobDetail.id, rejectReason); 
    setIsModalOpen(false);
    setRejectReason('');
  };

  // An toàn dữ liệu
  const skills = jobDetail.skills || []; 

  return (
    <div className="h-full flex flex-col bg-white">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
           <div className="flex items-start justify-between">
              <div>
                 <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                    <Building size={16}/> {jobDetail.companyName}
                 </div>
                 <h2 className="text-2xl font-bold text-blue-700">{jobDetail.title}</h2>
              </div>
              <div className="text-right">
                 <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200 uppercase">
                    Chờ duyệt
                 </span>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <InfoItem icon={<MapPin size={16} />} label="Địa điểm" value={jobDetail.location} />
              <InfoItem icon={<DollarSign size={16} />} label="Mức lương" value={formatSalary(jobDetail.minSalary, jobDetail.maxSalary)} />
              <InfoItem icon={<BarChart3 size={16} />} label="Cấp bậc" value={jobDetail.level} />
              <InfoItem icon={<Clock size={16} />} label="Hình thức" value={jobDetail.workType} />
           </div>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6 custom-scrollbar">
           {loadingDetail ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500"/></div>
           ) : (
              <>
                 <DetailSection 
                    title="Mô tả Công việc" 
                    icon={<FileText size={18} className="text-blue-500"/>} 
                    content={jobDetail.description}
                 />

                 <DetailSection 
                    title="Yêu cầu Ứng viên" 
                    icon={<ListChecks size={18} className="text-orange-500"/>} 
                    content={jobDetail.requirements}
                 />

                 <DetailSection 
                    title="Quyền lợi" 
                    icon={<Award size={18} className="text-green-500"/>} 
                    content={jobDetail.benefits}
                 />

                 {/* Skills (Nếu có) */}
                 {/* Lưu ý: Nếu Backend gộp skills vào requirements rồi thì phần này có thể trống */}
                 {skills.length > 0 && (
                    <div>
                       <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Kỹ năng yêu cầu</h4>
                       <div className="flex flex-wrap gap-2">
                          {skills.map((skill, idx) => (
                             <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                {skill}
                             </span>
                          ))}
                       </div>
                    </div>
                 )}
              </>
           )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end space-x-3">
           <button
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 rounded-lg bg-red-50 px-5 py-2.5 font-bold text-red-600 border border-red-100 hover:bg-red-100 transition"
           >
              <X size={18} /> Từ chối
           </button>
           <button
              onClick={() => onApprove(jobDetail.id)} 
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-green-700 transition transform active:scale-95"
           >
              <Check size={18} /> Duyệt bài đăng
           </button>
        </div>

        {/* MODAL REJECT */}
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
                       <h3 className="text-lg font-bold text-red-800">Từ chối bài đăng?</h3>
                    </div>
                    
                    <div className="p-6">
                       <p className="text-gray-600 mb-4 text-sm">
                          Bạn có chắc muốn từ chối Job: <strong>{jobDetail.title}</strong>?
                       </p>
                       <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do (Bắt buộc):</label>
                       <textarea 
                          rows={3}
                          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none border-gray-300"
                          placeholder="VD: Nội dung không phù hợp, sai quy định..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          autoFocus
                       />
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                       <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Hủy</button>
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

export default JobApprovalCard;