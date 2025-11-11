import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// "IMPORT" (IMPORT) "CÁI" (THE) "CARD" (CARD) "CHI TIẾT" (DETAIL) "TA" (WE) "VỪA" (JUST) "LÀM" (BUILT) (FILE 1/3)
import JobApprovalCard from '../../components/admin/JobApprovalCard'; 
import { Building, Clock, Search, FileSearch } from 'lucide-react';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
// (Đây "là" (is) "data" (data) "lấy" (taken) "từ" (from) "cái" (the) "form" (form) `PostJob.jsx` "gửi" (sent) "lên" (up))
const MOCK_PENDING_JOBS = [
  { 
    id: 'job1', 
    title: 'Senior React Developer (Chờ)',
    companyName: 'FPT Software',
    location: 'Hà Nội',
    salary: '30 - 50 triệu',
    level: 'Senior',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js'],
    description: '<h3>Mô tả công việc</h3><ul><li>Phát triển...</li><li>Tối ưu...</li></ul>',
    requirements: '<h3>Yêu cầu</h3><ol><li>5+ năm kinh nghiệm React.</li><li>Tiếng Anh tốt.</li></ol>',
    benefits: '<h3>Quyền lợi</h3><p>BHXH, Lương tháng 13, Du lịch...</p>',
    submittedAt: '20 phút trước'
  },
  { 
    id: 'job2', 
    title: 'Fresher .NET (Chờ)',
    companyName: 'Viettel Solutions',
    location: 'Đà Nẵng',
    salary: 'Thỏa thuận',
    level: 'Fresher',
    type: 'Full-time',
    skills: ['.NET', 'C#', 'SQL'],
    description: '<h3>Mô tả công việc</h3><p>Đào tạo C#...</p>',
    requirements: '<h3>Yêu cầu</h3><p>Tốt nghiệp CNTT...</p>',
    benefits: '<h3>Quyền lợi</h3><p>Trợ cấp ăn trưa...</p>',
    submittedAt: '2 giờ trước'
  },
];
// ------------------------------------

// --- "Component" (Component) "con" (child) "cho" (for) "CỘT TRÁI" (LEFT COLUMN) ---
// "Đây" (This) "là" (is) "1" (one) "cái" (a) "item" (item) "trong" (in) "list" (list) "chờ" (pending)
const PendingItem = ({ job, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-3 rounded-lg border-b
                transition-colors duration-200
                ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
  >
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-sm text-gray-900 truncate">{job.title}</h4>
      <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
        {job.submittedAt}
      </span>
    </div>
    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
      <Building size={14} /> {job.companyName}
    </p>
  </button>
);
// ------------------------------------

const AdminModerateJobsPage = () => {
  // --- "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS) ---
  const [pendingJobs, setPendingJobs] = useState(MOCK_PENDING_JOBS);
  const [selectedJobId, setSelectedJobId] = useState(MOCK_PENDING_JOBS[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "Lọc" (Filter) "bằng" (by) "Search" (Search)
  const filteredList = pendingJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // "Tìm" (Find) "ra" (out) "data" (data) "của" (of) "thằng" (guy) "đang" (being) "được" (selected) "chọn" (selected)
  const selectedJob = pendingJobs.find(job => job.id === selectedJobId);

  // --- "LOGIC" (LOGIC) "DUYỆT" (APPROVE) / "TỪ CHỐI" (REJECT) ---
  
  const handleApprove = (jobId) => {
    console.log(`ĐÃ DUYỆT job ID: ${jobId}`);
    // (Sau "này" (later) "gọi" (call) "API" (API) "để" (to) "Duyệt" (Approve) "ở" (at) "đây" (here))
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingJobs.filter(job => job.id !== jobId);
    setPendingJobs(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedJobId(newList[0]?.id || null);
  };

  const handleReject = (jobId, reason) => {
    console.log(`ĐÃ TỪ CHỐI job ID: ${jobId}, Lý do: ${reason}`);
    // (Sau "này" (later) "gọi" (call) "API" (API) "để" (to) "Từ chối" (Reject) "với" (with) "lý do" (reason) "ở" (at) "đây" (here))
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingJobs.filter(job => job.id !== jobId);
    setPendingJobs(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedJobId(newList[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt Job Đăng</h1>
      
      {/* "LAYOUT" (LAYOUT) "2" (TWO) "CỘT" (COLUMNS) "CHIA" (SPLIT) "MÀN HÌNH" (SCREEN) */}
      {/* "Tái" (Re-) "sử dụng" (use) "layout" (layout) "y hệt" (exactly like) "trang" (page) "Duyệt Employer" (Approve Employer) */}
      <div className="flex h-[calc(100vh-12rem)] rounded-xl bg-white shadow-lg overflow-hidden">
        
        {/* CỘT 1: "DANH SÁCH" (LIST) "CHỜ" (PENDING) (BÊN TRÁI) */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* "Header" (Header) "Cột 1" (Column 1) (Search) */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={18} />
              Đang chờ duyệt ({filteredList.length})
            </h3>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo Tên Job, Tên Công ty..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* "List" (List) "Cột 1" (Column 1) (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map(job => (
                <PendingItem
                  key={job.id}
                  job={job}
                  isActive={selectedJobId === job.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 p-4">
                {searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Job nào chờ duyệt.'}
              </p>
            )}
          </div>
        </div>

        {/* CỘT 2: "CHI TIẾT" (DETAIL) "JOB" (JOB) (BÊN PHẢI) */}
        <div className="w-2/3">
          <AnimatePresence mode="wait">
            {selectedJob ? (
              // "NẾU" (IF) "CÓ" (HAVE) "JOB" (JOB) "ĐANG" (BEING) "CHỌN" (SELECTED), "GỌI" (CALL) "FILE 1/3" (FILE 1/3)
              <motion.div
                key={selectedJob.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <JobApprovalCard 
                  job={selectedJob}
                  onApprove={handleApprove} // "Truyền" (Pass) "hàm" (function) "Duyệt" (Approve) "xuống" (down)
                  onReject={handleReject}   // "Truyền" (Pass) "hàm" (function) "Từ chối" (Reject) "xuống" (down)
                />
              </motion.div>
            ) : (
              // "NẾU" (IF) "KHÔNG CÓ" (HAVE NO) "AI" (ANYONE) "TRONG" (IN) "LIST" (LIST) "ĐỂ" (TO) "CHỌN" (SELECT)
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FileSearch size={40} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    {pendingJobs.length > 0 
                      ? "Chọn một Job để xem chi tiết" 
                      : (searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Job nào chờ duyệt.')
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

export default AdminModerateJobsPage;