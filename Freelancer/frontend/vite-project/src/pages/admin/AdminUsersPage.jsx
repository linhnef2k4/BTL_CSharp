import React, { useState } from 'react';
// --- "FIX" (FIX) "LÀ" (IS) "Ở" (AT) "ĐÂY" (HERE) ---
import { Search, User, Users, Briefcase, ShieldOff, Star } from 'lucide-react'; // <-- "TÔI" (I) "ĐÃ" (HAVE) "THÊM" (ADDED) "Users" (Users) (số "nhiều" (plural)) "VÀO" (INTO) "ĐÂY" (HERE)
// --- "HẾT" (END) "FIX" (FIX) ---
import UserActions from '../../components/admin/UserActions'; 

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
const MOCK_USERS = [
  { id: 'u1', name: 'Minh Tuấn (Seeker)', email: 'minhtuan@email.com', avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan', role: 'Seeker_VIP', status: 'Hoạt động' },
  { id: 'u2', name: 'FPT Software (Employer)', email: 'hr@fpt.com', avatar: 'https://placehold.co/40x40/f03c2e/ffffff?text=F', role: 'Employer_VIP', status: 'Hoạt động' },
  { id: 'u3', name: 'Ngọc Ánh (Seeker)', email: 'ngocanh@email.com', avatar: 'https://ui-avatars.com/api/?name=Ngoc+Anh', role: 'Seeker_Free', status: 'Hoạt động' },
  { id: 'u4', name: 'Teko Vietnam (Employer)', email: 'hr@teko.vn', avatar: 'https://placehold.co/40x40/ff7e1a/ffffff?text=T', role: 'Employer_Free', status: 'Hoạt động' },
  { id: 'u5', name: 'Spammer 01 (Seeker)', email: 'spammer@email.com', avatar: 'https://ui-avatars.com/api/?name=S', role: 'Seeker_Free', status: 'Bị khóa' },
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

// 2. "Tag" (Tag) "Vai trò" (Role) "cho" (for) "đẹp" (pretty)
const RoleTag = ({ role }) => {
  if (role.includes('VIP')) {
    return <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800"><Star size={12}/> {role.replace('_', ' ')}</span>;
  }
  if (role.includes('Employer')) {
    return <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"><Briefcase size={12}/> {role.replace('_', ' ')}</span>;
  }
  return <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700"><User size={12}/> {role.replace('_', ' ')}</span>;
};

// 3. "Tag" (Tag) "Trạng thái" (Status) "cho" (for) "đẹp" (pretty)
const StatusTag = ({ status }) => {
  if (status === 'Hoạt động') {
    return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">✅ {status}</span>;
  }
  return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">⛔️ {status}</span>;
};
// ------------------------------------

const AdminUsersPage = () => {
  // "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS)
  const [allUsers] = useState(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);
  const [activeTab, setActiveTab] = useState('all'); // "all", "seekers", "employers", "banned"
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "LỌC" (FILTER) "TỔNG" (MASTER)
  const filterAndSearch = (tab, term) => {
    let tempUsers = [...allUsers];
    
    // 1. "Lọc" (Filter) "theo" (by) "TAB" (TAB) "trước" (first)
    if (tab === 'seekers') {
      tempUsers = tempUsers.filter(u => u.role.includes('Seeker'));
    } else if (tab === 'employers') {
      tempUsers = tempUsers.filter(u => u.role.includes('Employer'));
    } else if (tab === 'banned') {
      tempUsers = tempUsers.filter(u => u.status === 'Bị khóa');
    }

    // 2. "Lọc" (Filter) "theo" (by) "SEARCH" (SEARCH) "sau" (second)
    if (term) {
      tempUsers = tempUsers.filter(u => 
        u.name.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredUsers(tempUsers);
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
      <h1 className="text-3xl font-bold text-gray-900">Quản lý User</h1>

      {/* "Card" (Card) "chính" (main) "chứa" (containing) "toàn" (all) "bộ" (set) "bảng" (table) */}
      <div className="rounded-xl bg-white shadow-lg">
        
        {/* 1. "Header" (Header) "của" (of) "Card" (Card): "Tabs" (Tabs) "Lọc" (Filter) "và" (and) "Search" (Search) */}
        <div className="p-4 border-b">
          {/* "Hàng" (Row) "1: TABS" (TABS) */}
          <div className="flex -mb-px space-x-2 border-b overflow-x-auto">
            <FilterTab 
              label="Tất cả" 
              icon={<Users size={16} />} // <-- "CÁI" (THE) "NÀY" (THIS) "GÂY" (CAUSED) "LỖI" (THE BUG) "NÈ" (LOOK)!
              count={allUsers.length}
              isActive={activeTab === 'all'} 
              onClick={() => handleTabClick('all')} 
            />
            <FilterTab 
              label="Seekers" 
              icon={<User size={16} />} 
              count={allUsers.filter(u => u.role.includes('Seeker')).length}
              isActive={activeTab === 'seekers'} 
              onClick={() => handleTabClick('seekers')} 
            />
            <FilterTab 
              label="Employers" 
              icon={<Briefcase size={16} />} 
              count={allUsers.filter(u => u.role.includes('Employer')).length}
              isActive={activeTab === 'employers'} 
              onClick={() => handleTabClick('employers')} 
            />
            <FilterTab 
              label="Bị khóa" 
              icon={<ShieldOff size={16} />} 
              count={allUsers.filter(u => u.status === 'Bị khóa').length}
              isActive={activeTab === 'banned'} 
              onClick={() => handleTabClick('banned')} 
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
                placeholder="Tìm kiếm theo Tên hoặc Email..."
                className="w-full max-w-md rounded-full bg-gray-100 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. "BẢNG" (TABLE) "DỮ LIỆU" (DATA) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* "Tiêu đề" (Header) "Bảng" (Table) */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên / Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            
            {/* "Thân" (Body) "Bảng" (Table) */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* "Cột" (Column) 1: "Tên" (Name) + "Avatar" (Avatar) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* "Cột" (Column) 2: "Vai trò" (Role) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleTag role={user.role} />
                  </td>
                  {/* "Cột" (Column) 3: "Trạng thái" (Status) */}
                  <td className="px-6 py-4 whitespace-nowW-rap">
                    <StatusTag status={user.status} />
                  </td>
                  {/* "CỘT" (COLUMN) 4: "HÀNH ĐỘNG" (ACTIONS) (DÙNG "FILE 1/3") */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <UserActions user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* "Trường hợp" (Case) "không" (not) "tìm" (find) "thấy" (any) "user" (user) */}
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy user nào phù hợp.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// "DÒNG" (LINE) "THẦN THÁNH" (DIVINE) "FIX" (FIX) "LỖI" (BUG) "LÀ" (IS) "ĐÂY" (HERE)
export default AdminUsersPage;