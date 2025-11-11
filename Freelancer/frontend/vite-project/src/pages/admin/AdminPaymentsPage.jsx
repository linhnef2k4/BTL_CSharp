import React, { useState } from 'react';
import { Search, DollarSign, CheckCircle, RefreshCw, Star, User } from 'lucide-react';
// "IMPORT" (IMPORT) "CÁI" (THE) "NÚT" (BUTTON) "HOÀN TIỀN" (REFUND) (FILE 1/3) "VÀO" (IN) "ĐỂ" (TO) "DÙNG" (USE)
import PaymentActions from '../../components/admin/PaymentActions'; 

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
const MOCK_PAYMENTS = [
  { id: 'pay1', user: 'FPT Software (Employer)', email: 'hr@fpt.com', package: 'Employer_VIP', amount: '2.000.000', status: 'Thành công', date: '2025-11-10' },
  { id: 'pay2', user: 'Minh Tuấn (Seeker)', email: 'minhtuan@email.com', package: 'Seeker_VIP', amount: '99.000', status: 'Thành công', date: '2025-11-09' },
  { id: 'pay3', user: 'Teko Vietnam (Employer)', email: 'hr@teko.vn', package: 'Employer_VIP', amount: '2.000.000', status: 'Đã hoàn tiền', date: '2025-11-08' },
  { id: 'pay4', user: 'Lê Nga (Seeker)', email: 'lenga@email.com', package: 'Seeker_VIP', amount: '99.000', status: 'Thành công', date: '2025-11-07' },
];
// ------------------------------------

// --- "Linh kiện" (Component) "con" (child) ---
// 1. "Nút" (Button) "Tab" (Tab) "Lọc" (Filter)
const FilterTab = ({ label, icon, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2
                transition-all duration-200
                ${isActive
                  ? 'border-blue-600 text-blue-600' // Style "Active" (Active)
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800' // Style "Thường" (Normal)
                }`}
  >
    {icon}
    <span>{label}</span>
    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
      {count}
    </span>
  </button>
);

// 2. "Tag" (Tag) "Gói VIP" (VIP Package)
const PackageTag = ({ pkg }) => {
  if (pkg.includes('Employer')) {
    return <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"><Star size={12}/> {pkg.replace('_', ' ')}</span>;
  }
  return <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800"><User size={12}/> {pkg.replace('_', ' ')}</span>;
};

// 3. "Tag" (Tag) "Trạng thái" (Status) "Thanh toán" (Payment)
const PaymentStatusTag = ({ status }) => {
  if (status === 'Thành công') {
    return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">✅ {status}</span>;
  }
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">🔄 {status}</span>;
};
// ------------------------------------

const AdminPaymentsPage = () => {
  // "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS)
  const [allPayments] = useState(MOCK_PAYMENTS);
  const [filteredPayments, setFilteredPayments] = useState(MOCK_PAYMENTS);
  const [activeTab, setActiveTab] = useState('all'); // "all", "success", "refunded"
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "LỌC" (FILTER) "TỔNG" (MASTER)
  const filterAndSearch = (tab, term) => {
    let tempPayments = [...allPayments];
    
    // 1. "Lọc" (Filter) "theo" (by) "TAB" (TAB) "trước" (first)
    if (tab === 'success') {
      tempPayments = tempPayments.filter(p => p.status === 'Thành công');
    } else if (tab === 'refunded') {
      tempPayments = tempPayments.filter(p => p.status === 'Đã hoàn tiền');
    }

    // 2. "Lọc" (Filter) "theo" (by) "SEARCH" (SEARCH) "sau" (second)
    if (term) {
      tempPayments = tempPayments.filter(p => 
        p.user.toLowerCase().includes(term.toLowerCase()) ||
        p.email.toLowerCase().includes(term.toLowerCase()) ||
        p.id.toLowerCase().includes(term.toLowerCase()) // "Cho" (Allow) "search" (search) "theo" (by) "Mã Giao dịch" (Transaction ID)
      );
    }
    
    setFilteredPayments(tempPayments);
  };

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "Click" (click) "Tab" (Tab)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    filterAndSearch(tab, searchTerm);
  };

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "Gõ" (type) "Search" (Search)
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterAndSearch(activeTab, term);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Lịch sử Giao dịch</h1>

      {/* "Card" (Card) "chính" (main) "chứa" (containing) "toàn" (all) "bộ" (set) "bảng" (table) */}
      <div className="rounded-xl bg-white shadow-lg">
        
        {/* 1. "Header" (Header) "của" (of) "Card" (Card): "Tabs" (Tabs) "Lọc" (Filter) "và" (and) "Search" (Search) */}
        <div className="p-4 border-b">
          {/* "Hàng" (Row) "1: TABS" (TABS) */}
          <div className="flex -mb-px space-x-2 border-b overflow-x-auto">
            <FilterTab 
              label="Tất cả" 
              icon={<DollarSign size={16} />} 
              count={allPayments.length}
              isActive={activeTab === 'all'} 
              onClick={() => handleTabClick('all')} 
            />
            <FilterTab 
              label="Thành công" 
              icon={<CheckCircle size={16} />} 
              count={allPayments.filter(p => p.status === 'Thành công').length}
              isActive={activeTab === 'success'} 
              onClick={() => handleTabClick('success')} 
            />
            <FilterTab 
              label="Đã hoàn tiền" 
              icon={<RefreshCw size={16} />} 
              count={allPayments.filter(p => p.status === 'Đã hoàn tiền').length}
              isActive={activeTab === 'refunded'} 
              onClick={() => handleTabClick('refunded')} 
            />
          </div>
          
          {/* "Hàng" (Row) "2: SEARCH" (SEARCH) */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm theo Tên User, Email, Mã Giao dịch..."
                className="w-full max-w-md rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. "BẢNG" (TABLE) "DỮ LIỆU" (DATA) (Cho "phép" (allow) "scroll" (scroll) "ngang" (horizontally) "trên" (on) "mobile" (mobile)) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* "Tiêu đề" (Header) "Bảng" (Table) */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User / Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Gói</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            
            {/* "Thân" (Body) "Bảng" (Table) */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  {/* "Cột" (Column) 1: "User" (User) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-gray-900">{transaction.user}</p>
                    <p className="text-sm text-gray-500">{transaction.email}</p>
                  </td>
                  {/* "Cột" (Column) 2: "Gói" (Package) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PackageTag pkg={transaction.package} />
                  </td>
                  {/* "Cột" (Column) 3: "Số tiền" (Amount) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{transaction.amount} VNĐ</span>
                  </td>
                  {/* "Cột" (Column) 4: "Trạng thái" (Status) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentStatusTag status={transaction.status} />
                  </td>
                  {/* "Cột" (Column) 5: "Ngày" (Date) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  {/* "CỘT" (COLUMN) 6: "HÀNH ĐỘNG" (ACTIONS) (DÙNG "FILE 1/3") */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <PaymentActions transaction={transaction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* "Trường hợp" (Case) "không" (not) "tìm" (find) "thấy" (any) "giao dịch" (transaction) */}
          {filteredPayments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy giao dịch nào phù hợp.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPaymentsPage;