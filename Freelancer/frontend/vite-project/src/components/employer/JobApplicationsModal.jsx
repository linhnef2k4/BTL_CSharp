import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, FileText, Download, CheckCircle, XCircle, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectService from '../../../services/projectService';
import applicationService from '../../../services/applicationService';
import { formatTimeAgo } from '../../utils/formatUtils';
import { useToast } from '../../context/ToastContext';

const JobApplicationsModal = ({ jobId, onClose }) => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null); // Ứng viên đang xem chi tiết
  const [loading, setLoading] = useState(true);

  // Load danh sách ứng viên
  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await projectService.getJobApplications(jobId);
        setApplications(res.data);
        // Mặc định chọn ứng viên đầu tiên nếu có
        if (res.data && res.data.length > 0) setSelectedApp(res.data[0]);
      } catch (error) {
        console.error("Lỗi tải ứng viên:", error);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchApps();
  }, [jobId]);

  // Xử lý Duyệt/Từ chối
  const handleStatusChange = async (status) => {
     if (!selectedApp) return;
     try {
        await applicationService.updateStatus(selectedApp.id, status);
        
        // Cập nhật UI (Optimistic update)
        const updatedList = applications.map(app => 
            app.id === selectedApp.id ? { ...app, status: status } : app
        );
        setApplications(updatedList);
        setSelectedApp({ ...selectedApp, status: status });
        
        addToast(`Đã cập nhật trạng thái: ${status}`, 'success');
     } catch (error) {
        addToast('Lỗi cập nhật trạng thái', 'error');
     }
  }

  const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${name?.replace(/\s/g, '+')}&background=random&color=fff`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        
        {/* --- LEFT: LIST ỨNG VIÊN --- */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
           <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-800">Danh sách ({applications.length})</h3>
              <button onClick={onClose} className="md:hidden p-1 bg-gray-100 rounded-full"><X size={18}/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {loading ? (
                 <p className="text-center text-gray-400 py-10 text-sm">Đang tải...</p>
              ) : applications.length === 0 ? (
                 <p className="text-center text-gray-400 py-10 text-sm">Chưa có ứng viên nào.</p>
              ) : (
                 applications.map(app => (
                    <div 
                       key={app.id}
                       onClick={() => setSelectedApp(app)}
                       className={`p-3 rounded-xl cursor-pointer transition border flex gap-3 items-start
                          ${selectedApp?.id === app.id 
                             ? 'bg-blue-50 border-blue-200 shadow-sm' 
                             : 'bg-white border-transparent hover:bg-gray-100 hover:border-gray-200'}`}
                    >
                       <img src={getAvatarUrl(app.seekerFullName)} className="w-10 h-10 rounded-full border" alt="" />
                       <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm truncate ${selectedApp?.id === app.id ? 'text-blue-700' : 'text-gray-800'}`}>
                             {app.seekerFullName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{app.seekerHeadline || 'Ứng viên'}</p>
                          <div className="flex justify-between items-center mt-1">
                             <span className="text-[10px] text-gray-400">{formatTimeAgo(app.appliedDate)}</span>
                             {/* Badge trạng thái */}
                             {app.status === 'Viewed' && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">Đã xem</span>}
                             {app.status === 'Accepted' && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Đã duyệt</span>}
                             {app.status === 'Rejected' && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Từ chối</span>}
                          </div>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* --- RIGHT: CHI TIẾT ỨNG VIÊN --- */}
        <div className="w-full md:w-2/3 flex flex-col bg-white h-full">
           {selectedApp ? (
              <>
                 {/* Header Chi tiết */}
                 <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div className="flex gap-4">
                       <img src={getAvatarUrl(selectedApp.seekerFullName)} className="w-16 h-16 rounded-full border-4 border-gray-50 shadow-sm" alt="" />
                       <div>
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                             {selectedApp.seekerFullName}
                             <Link to={`/profile/${selectedApp.seekerId}`} target="_blank" className="text-gray-400 hover:text-blue-600">
                                <ExternalLink size={18} />
                             </Link>
                          </h2>
                          <p className="text-gray-500">{selectedApp.seekerHeadline}</p>
                          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                             <Mail size={12}/> {selectedApp.seekerEmail}
                          </p>
                       </div>
                    </div>
                    <button onClick={onClose} className="hidden md:block p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
                 </div>

                 {/* Body Scrollable */}
                 <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Cover Letter */}
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <MessageCircle size={18} className="text-blue-500"/> Thư giới thiệu
                       </h3>
                       <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {selectedApp.coverLetter || "Ứng viên không để lại lời nhắn."}
                       </p>
                    </div>

                    {/* CV */}
                    <div>
                       <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText size={18} className="text-red-500"/> Hồ sơ đính kèm (CV)
                       </h3>
                       {selectedApp.cvUrl ? (
                          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition group">
                             <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2 rounded text-red-600"><FileText size={24}/></div>
                                <div>
                                   <p className="font-semibold text-gray-800 group-hover:text-blue-600">CV_{selectedApp.seekerFullName}.pdf</p>
                                   <p className="text-xs text-gray-400">Nhấn nút bên phải để tải về</p>
                                </div>
                             </div>
                             <a href={selectedApp.cvUrl} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-blue-600 hover:text-white transition">
                                <Download size={20}/>
                             </a>
                          </div>
                       ) : (
                          <p className="text-sm text-gray-400 italic">Không có CV.</p>
                       )}
                    </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button 
                       onClick={() => handleStatusChange('Rejected')}
                       className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                    >
                       <XCircle size={20}/> Từ chối
                    </button>
                    <button 
                       onClick={() => handleStatusChange('Accepted')}
                       className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform active:scale-95"
                    >
                       <CheckCircle size={20}/> Chấp nhận / Phỏng vấn
                    </button>
                 </div>
              </>
           ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                 <User size={64} className="opacity-20 mb-4"/>
                 <p>Chọn một ứng viên để xem chi tiết</p>
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};

import { MessageCircle } from 'lucide-react'; // Bổ sung import
export default JobApplicationsModal;