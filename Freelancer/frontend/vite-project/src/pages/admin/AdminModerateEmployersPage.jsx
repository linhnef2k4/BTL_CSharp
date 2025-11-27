import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Clock, Search, Loader2 } from 'lucide-react';
import EmployerApprovalCard from '../../components/admin/EmployerApprovalCard'; 
import adminService from '../../../services/adminService';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

// Component Item cột trái
const PendingItem = ({ employer, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-4 rounded-xl border-b border-gray-100
                transition-all duration-200 group
                ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50'}`}
  >
    <div className="flex items-center justify-between mb-1">
      <h4 className={`font-bold text-sm truncate max-w-[70%] ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
          {employer.companyName}
      </h4>
      {/* Hiển thị thời gian (Giả lập vì DTO chưa có SubmittedAt, có thể bổ sung sau) */}
      <span className="text-[10px] text-gray-400 flex items-center gap-1">
         <Clock size={10} /> Mới
      </span>
    </div>
    <p className="text-xs text-gray-500 truncate group-hover:text-gray-700">
        HR: {employer.fullName}
    </p>
    <p className="text-xs text-gray-400 truncate">
        {employer.email}
    </p>
  </button>
);

const AdminModerateEmployersPage = () => {
  const { addToast } = useToast();
  
  // --- STATE ---
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- 1. FETCH DATA ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingEmployers(debouncedSearch);
      setPendingEmployers(res.data);
      
      // Nếu list không rỗng và chưa chọn ai -> Chọn người đầu tiên
      if (res.data.length > 0 && !selectedEmployerId) {
        setSelectedEmployerId(res.data[0].id);
      }
      // Nếu list rỗng -> Reset chọn
      if (res.data.length === 0) {
        setSelectedEmployerId(null);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      addToast("Không thể tải danh sách yêu cầu.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [debouncedSearch]);

  // Chọn employer object từ ID
  const selectedEmployer = pendingEmployers.find(emp => emp.id === selectedEmployerId);

  // --- 2. XỬ LÝ DUYỆT ---
  const handleApprove = async (employerId) => {
    try {
        await adminService.approveEmployer(employerId);
        addToast("Đã duyệt nhà tuyển dụng thành công.", "success");
        
        // Xóa khỏi list local (Optimistic Update)
        const newList = pendingEmployers.filter(emp => emp.id !== employerId);
        setPendingEmployers(newList);
        
        // Chọn người tiếp theo
        if (newList.length > 0) setSelectedEmployerId(newList[0].id);
        else setSelectedEmployerId(null);

    } catch (error) {
        console.error(error);
        addToast("Duyệt thất bại. Vui lòng thử lại.", "error");
    }
  };

  // --- 3. XỬ LÝ TỪ CHỐI ---
  const handleReject = async (employerId, reason) => {
    try {
        // Backend API Reject hiện tại chỉ nhận ID (chưa lưu lý do vào DB).
        // Nhưng ta vẫn nhận reason từ UI để sau này nâng cấp backend dễ dàng.
        await adminService.rejectEmployer(employerId);
        addToast("Đã từ chối yêu cầu.", "info");

        const newList = pendingEmployers.filter(emp => emp.id !== employerId);
        setPendingEmployers(newList);
        
        if (newList.length > 0) setSelectedEmployerId(newList[0].id);
        else setSelectedEmployerId(null);

    } catch (error) {
        console.error(error);
        addToast("Từ chối thất bại.", "error");
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">Kiểm duyệt Nhà tuyển dụng</h1>
      
      {/* LAYOUT CHÍNH */}
      <div className="flex flex-1 rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        
        {/* CỘT TRÁI: LIST */}
        <div className="w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col bg-white">
          {/* Search */}
          <div className="p-4 border-b border-gray-100 bg-white z-10">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    Danh sách chờ
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{pendingEmployers.length}</span>
                </h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm công ty, email..."
                className="w-full rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 py-2 pl-9 pr-4 text-sm transition outline-none border"
              />
            </div>
          </div>
          
          {/* List Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500"/></div>
            ) : pendingEmployers.length > 0 ? (
              pendingEmployers.map(emp => (
                <PendingItem
                  key={emp.id}
                  employer={emp}
                  isActive={selectedEmployerId === emp.id}
                  onSelect={() => setSelectedEmployerId(emp.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center px-4">
                <Building size={32} className="mb-2 opacity-20"/>
                <p className="text-sm">
                    {searchTerm ? 'Không tìm thấy kết quả.' : 'Tuyệt vời! Không có yêu cầu nào đang chờ.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: DETAIL */}
        <div className="flex-1 bg-gray-50 relative">
          <AnimatePresence mode="wait">
            {selectedEmployer ? (
              <motion.div
                key={selectedEmployer.id} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <EmployerApprovalCard 
                  employer={selectedEmployer}
                  onApprove={handleApprove} 
                  onReject={handleReject}   
                />
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center">
                  <Building size={64} className="mx-auto opacity-10 mb-4" />
                  <p>Chọn một hồ sơ bên trái để xem chi tiết</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminModerateEmployersPage;