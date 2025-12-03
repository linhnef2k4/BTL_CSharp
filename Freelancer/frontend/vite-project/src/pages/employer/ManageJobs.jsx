import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, Trash2, RefreshCcw, Users, Eye, 
  MoreVertical, Search, Loader2, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import projectService from '../../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatSalary, formatTimeAgo } from '../../utils/formatUtils';

// Import Modal quản lý ứng viên
import JobApplicationsModal from '../../components/employer/JobApplicationsModal';

const ManageJobs = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // 'active' | 'pending' | 'trash'
  const [activeTab, setActiveTab] = useState('active'); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal Ứng viên
  const [selectedJobId, setSelectedJobId] = useState(null); // ID job đang xem ứng viên
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LOAD DATA ---
  const fetchJobs = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'active') {
         // Lấy job đã duyệt của tôi
         // Lưu ý: Hàm này trong service đang dùng workaround lọc client-side nếu chưa có API backend chuẩn
         res = await projectService.getMyActiveProjects(user.id);
      } else if (activeTab === 'pending') {
         // Lấy job chờ duyệt
         res = await projectService.getMyPendingProjects();
      } else if (activeTab === 'trash') {
         // Lấy thùng rác
         res = await projectService.getTrash();
      }
      
      // Đảm bảo data luôn là mảng
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi tải jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
        fetchJobs();
    }
  }, [activeTab, user]);

  // --- ACTIONS (XÓA / KHÔI PHỤC) ---
  const handleDelete = async (id, isPermanent = false) => {
    if (!window.confirm(isPermanent ? "CẢNH BÁO: Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa vĩnh viễn?" : "Bạn muốn chuyển tin này vào thùng rác?")) return;

    try {
      if (isPermanent) {
        await projectService.deletePermanent(id);
        addToast("Đã xóa vĩnh viễn.", "success");
      } else {
        await projectService.deleteProject(id);
        addToast("Đã chuyển vào thùng rác.", "info");
      }
      // Refresh list (Optimistic update)
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      const msg = error.response?.data || "Có lỗi xảy ra.";
      addToast(msg, "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      await projectService.restoreProject(id);
      addToast("Khôi phục thành công.", "success");
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      addToast("Lỗi khi khôi phục.", "error");
    }
  };

  // Mở modal ứng viên
  const openApplications = (jobId) => {
      setSelectedJobId(jobId);
      setIsModalOpen(true);
  }

  // --- RENDER TAB BUTTON ---
  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-medium transition-all border-b-2 
        ${activeTab === id 
          ? 'border-blue-600 text-blue-600 bg-blue-50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tuyển dụng</h1>
         <p className="text-gray-500 text-sm mt-1">Theo dõi trạng thái tin đăng và quản lý hồ sơ ứng viên.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
         <TabButton id="active" label="Đang tuyển" icon={<Briefcase size={18}/>} />
         <TabButton id="pending" label="Chờ duyệt" icon={<Clock size={18}/>} />
         <TabButton id="trash" label="Thùng rác" icon={<Trash2 size={18}/>} />
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[300px]">
         {loading ? (
            <div className="flex justify-center items-center h-60">
               <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
         ) : jobs.length > 0 ? (
            <div className="divide-y divide-gray-100">
               {jobs.map((job) => (
                  <div key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition gap-4">
                     
                     {/* Job Info */}
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                           <h3 className="font-bold text-gray-800 text-lg hover:text-blue-600 cursor-pointer truncate max-w-md">
                              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                           </h3>
                           {activeTab === 'active' && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                 Đang hiển thị
                              </span>
                           )}
                           {activeTab === 'pending' && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                 Đang xét duyệt
                              </span>
                           )}
                           {activeTab === 'trash' && (
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                 Đã xóa
                              </span>
                           )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                           <span>Mức lương: <strong className="text-gray-700">{formatSalary(job.minSalary, job.maxSalary)}</strong></span>
                           <span className="hidden md:inline">•</span>
                           <span>Đăng: {formatTimeAgo(job.createdDate)}</span>
                           <span className="hidden md:inline">•</span>
                           <span>{job.location}</span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center gap-3">
                        {/* Nút Xem Ứng Viên (Chỉ hiện ở tab Active) */}
                        {activeTab === 'active' && (
                           <button 
                              onClick={() => openApplications(job.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm text-sm"
                           >
                              <Users size={18} />
                              Xem ứng viên
                           </button>
                        )}

                        {/* Nút Khôi phục (Chỉ hiện ở Trash) */}
                        {activeTab === 'trash' && (
                           <button 
                              onClick={() => handleRestore(job.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition text-sm"
                           >
                              <RefreshCcw size={18} /> Khôi phục
                           </button>
                        )}

                        {/* Nút Xóa (Logic khác nhau từng tab) */}
                        <button 
                           onClick={() => handleDelete(job.id, activeTab === 'trash')}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                           title={activeTab === 'trash' ? "Xóa vĩnh viễn" : "Chuyển vào thùng rác"}
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
               <Briefcase size={48} className="mb-3 opacity-20" />
               <p>Không có tin tuyển dụng nào trong mục này.</p>
               {activeTab === 'active' && (
                   <Link to="/employer/post-job" className="mt-4 text-blue-600 font-medium hover:underline">
                       Đăng tin ngay
                   </Link>
               )}
            </div>
         )}
      </div>

      {/* MODAL ỨNG VIÊN */}
      {isModalOpen && (
         <JobApplicationsModal 
            jobId={selectedJobId} 
            onClose={() => setIsModalOpen(false)} 
         />
      )}
    </div>
  );
};

export default ManageJobs;