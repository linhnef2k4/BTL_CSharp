import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Clock, Search, FileSearch, Loader2 } from 'lucide-react';

import JobApprovalCard from '../../components/admin/JobApprovalCard'; 
import adminService from '../../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { formatTimeAgo } from '../../utils/formatUtils'; // Tận dụng helper cũ

// Component Item cột trái
const PendingItem = ({ job, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-4 rounded-xl border-b border-gray-100
                transition-all duration-200 group
                ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50'}`}
  >
    <div className="flex items-center justify-between mb-1">
      <h4 className={`font-bold text-sm truncate max-w-[70%] ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
          {job.title}
      </h4>
      <span className="text-[10px] text-gray-400 flex items-center gap-1">
         <Clock size={10} /> {formatTimeAgo(job.createdDate)}
      </span>
    </div>
    <p className="text-xs text-gray-500 truncate flex items-center gap-1 group-hover:text-gray-700">
      <Building size={12} /> {job.companyName}
    </p>
  </button>
);

const AdminModerateJobsPage = () => {
  const { addToast } = useToast();
  
  const [pendingJobs, setPendingJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data
  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingProjects();
      setPendingJobs(res.data);

      // Auto select first item
      if (res.data.length > 0 && !selectedJobId) {
        setSelectedJobId(res.data[0].id);
      } else if (res.data.length === 0) {
        setSelectedJobId(null);
      }
    } catch (error) {
      console.error("Lỗi tải job:", error);
      addToast("Không thể tải danh sách Job.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  // 2. Filter Client-side
  const filteredList = pendingJobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Lấy object job chi tiết
  const selectedJob = pendingJobs.find(job => job.id === selectedJobId);

  // 3. Handle Approve
  const handleApprove = async (jobId) => {
    try {
        await adminService.approveProject(jobId);
        addToast("Đã duyệt tin tuyển dụng.", "success");
        
        // Update UI
        const newList = pendingJobs.filter(j => j.id !== jobId);
        setPendingJobs(newList);
        
        if (newList.length > 0) setSelectedJobId(newList[0].id);
        else setSelectedJobId(null);

    } catch (error) {
        addToast("Duyệt thất bại.", "error");
    }
  };

  // 4. Handle Reject
  const handleReject = async (jobId, reason) => {
    try {
        await adminService.rejectProject(jobId);
        addToast("Đã từ chối tin tuyển dụng.", "info");
        
        // Update UI
        const newList = pendingJobs.filter(j => j.id !== jobId);
        setPendingJobs(newList);
        
        if (newList.length > 0) setSelectedJobId(newList[0].id);
        else setSelectedJobId(null);

    } catch (error) {
        addToast("Từ chối thất bại.", "error");
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">Kiểm duyệt Job Đăng</h1>
      
      <div className="flex flex-1 rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        
        {/* LEFT COLUMN */}
        <div className="w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col bg-white">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100 bg-white z-10">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    Chờ duyệt
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{pendingJobs.length}</span>
                </h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo Tên Job, Công ty..."
                className="w-full rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 pl-9 pr-4 text-sm transition outline-none border"
              />
            </div>
          </div>
          
          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {loading ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500"/></div>
            ) : filteredList.length > 0 ? (
              filteredList.map(job => (
                <PendingItem
                  key={job.id}
                  job={job}
                  isActive={selectedJobId === job.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center px-4">
                 <FileSearch size={32} className="mb-2 opacity-20" />
                 <p className="text-sm">
                    {searchTerm ? 'Không tìm thấy kết quả.' : 'Sạch sẽ! Không có Job nào chờ duyệt.'}
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 bg-gray-50 relative">
          <AnimatePresence mode="wait">
            {selectedJob ? (
              <motion.div
                key={selectedJob.id} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <JobApprovalCard 
                  jobId={selectedJob.id} // Truyền ID để Card tự load chi tiết Full
                  initialData={selectedJob} // Dữ liệu sơ bộ
                  onApprove={handleApprove} 
                  onReject={handleReject}   
                />
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center">
                  <FileSearch size={64} className="mx-auto opacity-10 mb-4" />
                  <p>Chọn một Job bên trái để xem chi tiết</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminModerateJobsPage;