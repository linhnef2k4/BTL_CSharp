import React, { useState, useEffect } from 'react';
import { Search, User, Users, Briefcase, ShieldOff, Star, Loader2 } from 'lucide-react';
import UserActions from '../../components/admin/UserActions'; 
import adminService from '../../../services/adminService';
import useDebounce from '../../hooks/useDebounce'; // Import hook debounce nếu có

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý bộ lọc
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'seekers', 'employers', 'banned'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search để tránh gọi API liên tục
  const debouncedSearch = useDebounce(searchTerm, 500); 

  // --- 1. HÀM GỌI API LẤY DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Chuẩn bị tham số cho API dựa trên Tab đang chọn
      const params = {
        search: debouncedSearch || null,
        role: null,
        trangThai: null // null = lấy hết, true = bị khóa, false = hoạt động
      };

      if (activeTab === 'seekers') params.role = 'Seeker';
      else if (activeTab === 'employers') params.role = 'Employer';
      else if (activeTab === 'banned') params.trangThai = true;

      const response = await adminService.getAllUsers(params);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi tải danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. EFFECT: GỌI LẠI KHI FILTER THAY ĐỔI ---
  useEffect(() => {
    fetchUsers();
  }, [activeTab, debouncedSearch]);

  // Callback để refresh lại list khi UserActions thực hiện thay đổi (ví dụ khóa user)
  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
         <div className="text-sm text-gray-500">Tổng số: {users.length} bản ghi</div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        
        {/* HEADER FILTER */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* TABS */}
            <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <FilterTab 
                label="Tất cả" icon={<Users size={16} />} 
                isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} 
              />
              <FilterTab 
                label="Ứng viên" icon={<User size={16} />} 
                isActive={activeTab === 'seekers'} onClick={() => setActiveTab('seekers')} 
              />
              <FilterTab 
                label="Nhà tuyển dụng" icon={<Briefcase size={16} />} 
                isActive={activeTab === 'employers'} onClick={() => setActiveTab('employers')} 
              />
              <FilterTab 
                label="Đã khóa" icon={<ShieldOff size={16} />} 
                isActive={activeTab === 'banned'} onClick={() => setActiveTab('banned')} 
              />
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên hoặc email..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* TABLE DATA */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
             </div>
          ) : (
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      {/* INFO */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                                className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                                src={getAvatarUrl(user)} 
                                alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* ROLE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleTag user={user} />
                      </td>
                      {/* STATUS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusTag isLocked={user.isLocked} />
                      </td>
                      {/* ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <UserActions user={user} onSuccess={handleRefresh} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                       Không tìm thấy dữ liệu phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTS CON ---

const FilterTab = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all
      ${isActive 
        ? 'bg-blue-50 text-blue-700 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const RoleTag = ({ user }) => {
  // Kiểm tra VIP từ DTO trả về
  const isVip = user.role === 'Seeker' ? user.seeker?.isVip : user.employer?.isVip;
  
  if (isVip) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      <Star size={10} fill="currentColor" /> VIP {user.role}
    </span>;
  }
  if (user.role === 'Employer') {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
      <Briefcase size={10} /> Nhà tuyển dụng
    </span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
    <User size={10} /> Ứng viên
  </span>;
};

const StatusTag = ({ isLocked }) => {
  if (!isLocked) {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Hoạt động
    </span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
    Đã khóa
  </span>;
};

// Helper lấy avatar từ DTO
const getAvatarUrl = (user) => {
    const avatar = user.seeker?.avatar || user.employer?.companyLogoUrl;
    if (avatar) return avatar;
    return `https://ui-avatars.com/api/?name=${user.fullName.replace(/\s/g, '+')}&background=random&color=fff`;
};

export default AdminUsersPage;