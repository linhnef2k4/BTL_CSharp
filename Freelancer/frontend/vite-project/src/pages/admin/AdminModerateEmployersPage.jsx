import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// "IMPORT" (IMPORT) "CÁI" (THE) "CARD" (CARD) "CHI TIẾT" (DETAIL) "TA" (WE) "VỪA" (JUST) "LÀM" (BUILT) (FILE 1/3)
import EmployerApprovalCard from '../../components/admin/EmployerApprovalCard'; 
import { Building, Clock, Search } from 'lucide-react';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
const MOCK_PENDING_EMPLOYERS = [
  { 
    id: 'emp1', 
    companyName: 'Công ty TNHH ABC (Chờ)', 
    taxCode: '0123456789', 
    website: 'https://abc-company.com',
    companySize: '101-500',
    hrName: 'Trần Văn A', 
    hrTitle: 'Trưởng phòng Nhân sự',
    hrEmail: 'a.tran@abc-company.com', 
    hrPhone: '0901234567',
    submittedAt: '1 giờ trước'
  },
  { 
    id: 'emp2', 
    companyName: 'Tập đoàn XYZ (Chờ)', 
    taxCode: '9876543210', 
    website: 'https://xyz-group.com',
    companySize: '501+',
    hrName: 'Nguyễn Thị B', 
    hrTitle: 'Chuyên viên Tuyển dụng',
    hrEmail: 'b.nguyen@xyz-group.com', 
    hrPhone: '0912345678',
    submittedAt: '3 giờ trước'
  },
];
// ------------------------------------

// --- "Component" (Component) "con" (child) "cho" (for) "CỘT TRÁI" (LEFT COLUMN) ---
const PendingItem = ({ employer, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-3 rounded-lg border-b
                transition-colors duration-200
                ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
  >
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-sm text-gray-900 truncate">{employer.companyName}</h4>
      <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
        {employer.submittedAt}
      </span>
    </div>
    <p className="text-sm text-gray-600 truncate">HR: {employer.hrName} ({employer.hrEmail})</p>
  </button>
);
// ------------------------------------

const AdminModerateEmployersPage = () => {
  // --- "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS) ---
  const [pendingEmployers, setPendingEmployers] = useState(MOCK_PENDING_EMPLOYERS);
  const [selectedEmployerId, setSelectedEmployerId] = useState(MOCK_PENDING_EMPLOYERS[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "Lọc" (Filter) "bằng" (by) "Search" (Search)
  const filteredList = pendingEmployers.filter(emp =>
    emp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.hrName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.hrEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // "Tìm" (Find) "ra" (out) "data" (data) "của" (of) "thằng" (guy) "đang" (being) "được" (selected) "chọn" (selected)
  const selectedEmployer = pendingEmployers.find(emp => emp.id === selectedEmployerId);

  // --- "LOGIC" (LOGIC) "DUYỆT" (APPROVE) / "TỪ CHỐI" (REJECT) ---
  const handleApprove = (employerId) => {
    console.log(`ĐÃ DUYỆT employer ID: ${employerId}`);
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingEmployers.filter(emp => emp.id !== employerId);
    setPendingEmployers(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedEmployerId(newList[0]?.id || null);
  };

  const handleReject = (employerId, reason) => {
    console.log(`ĐÃ TỪ CHỐI employer ID: ${employerId}, Lý do: ${reason}`);
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingEmployers.filter(emp => emp.id !== employerId);
    setPendingEmployers(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedEmployerId(newList[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt Employer</h1>
      
      {/* "LAYOUT" (LAYOUT) "2" (TWO) "CỘT" (COLUMNS) "CHIA" (SPLIT) "MÀN HÌNH" (SCREEN) */}
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
                placeholder="Tìm theo tên Công ty, HR, Email..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* "List" (List) "Cột 1" (Column 1) (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map(emp => (
                <PendingItem
                  key={emp.id}
                  employer={emp}
                  isActive={selectedEmployerId === emp.id}
                  onSelect={() => setSelectedEmployerId(emp.id)}
                />
              ))
            ) : (
              // --- "FIX" (FIX) "LÀ" (IS) "Ở" (AT) "ĐÂY" (HERE) ---
              // "Đổi" (Changed) `</VStack>` "thành" (to) `</p>` "cho" (to) "nó" (it) "chuẩn" (standard) "HTML" (HTML)
              <p className="text-center text-sm text-gray-500 p-4">
                {searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có ai chờ duyệt.'}
              </p>
              // --- "HẾT" (END) "FIX" (FIX) ---
            )}
          </div>
        </div>

        {/* CỘT 2: "CHI TIẾT" (DETAIL) "EMPLOYER" (EMPLOYER) (BÊN PHẢI) */}
        <div className="w-2/3">
          <AnimatePresence mode="wait">
            {selectedEmployer ? (
              // "NẾU" (IF) "CÓ" (HAVE) "EMPLOYER" (EMPLOYER) "ĐANG" (BEING) "CHỌN" (SELECTED), "GỌI" (CALL) "FILE 1/3" (FILE 1/3)
              <motion.div
                key={selectedEmployer.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <EmployerApprovalCard 
                  employer={selectedEmployer}
                  onApprove={handleApprove} 
                  onReject={handleReject}   
                />
              </motion.div>
            ) : (
              // "NẾU" (IF) "KHÔNG CÓ" (HAVE NO) "AI" (ANYONE) "TRONG" (IN) "LIST" (LIST) "ĐỂ" (TO) "CHỌN" (SELECT)
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Building size={40} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    {/* "Sửa" (Fix) "logic" (logic) "này" (this) "luôn" (too) "cho" (to be) "nó" (it) "chuẩn" (correct) */}
                    {pendingEmployers.length > 0 
                      ? "Chọn một Employer để xem chi tiết" 
                      : (searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có ai chờ duyệt.')
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

export default AdminModerateEmployersPage;