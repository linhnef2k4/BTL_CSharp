import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, User, MapPin } from 'lucide-react';
import jobService from '../../../services/jobService';

const JobSuggestions = () => {
  const [vipCompanies, setVipCompanies] = useState([]);
  const [vipSeekers, setVipSeekers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, seekersRes] = await Promise.all([
            jobService.getVipEmployers(),
            jobService.getVipSeekers()
        ]);

        // Xử lý dữ liệu: API có thể trả về 1 object hoặc 1 array
        // Chúng ta chuẩn hóa thành Array để dễ map
        const companiesData = companiesRes.data;
        const seekersData = seekersRes.data;

        const companies = Array.isArray(companiesData) ? companiesData : (companiesData ? [companiesData] : []);
        const seekers = Array.isArray(seekersData) ? seekersData : (seekersData ? [seekersData] : []);

        setVipCompanies(companies);
        setVipSeekers(seekers);
      } catch (error) {
        console.error("Lỗi tải gợi ý:", error);
      }
    };
    fetchData();
  }, []);

  // Helper fallback
  const getLogo = (name, url) => url || `https://placehold.co/40x40/00529c/ffffff?text=${name?.charAt(0) || 'C'}`;
  const getAvatar = (name, url) => url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

  return (
    <div className="sticky top-20 space-y-5">
      
      {/* Card 1: Công ty Nổi bật (Employer VIP) */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-md font-bold text-gray-800 flex items-center gap-2">
           <Building size={18} className="text-blue-600" /> Nhà tuyển dụng hàng đầu
        </h3>
        <div className="space-y-4">
          {vipCompanies.length > 0 ? vipCompanies.map((user) => {
            // Dữ liệu nằm trong user.employer
            const emp = user.employer; 
            if (!emp) return null;

            return (
              <Link key={user.id} to={`/company/${user.id}`} className="flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition">
                <img 
                  src={getLogo(emp.companyName, emp.logoCompany)} 
                  alt="Logo" 
                  className="h-12 w-12 rounded-lg border object-contain bg-white" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 truncate">
                      {emp.companyName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                     {emp.address && <span className="truncate max-w-[80px]">{emp.address}</span>}
                     <span>• {emp.companySize} NV</span>
                  </div>
                </div>
              </Link>
            );
          }) : (
             <p className="text-xs text-gray-400 italic text-center">Đang cập nhật danh sách...</p>
          )}
        </div>
      </div>

      {/* Card 2: Ứng viên tài năng (Seeker VIP) */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-md font-bold text-gray-800 flex items-center gap-2">
           <User size={18} className="text-green-600" /> Ứng viên tài năng
        </h3>
        <div className="space-y-4">
          {vipSeekers.length > 0 ? vipSeekers.map((user) => {
            // Dữ liệu nằm trong user.seeker
            const seeker = user.seeker;
            if (!seeker) return null;

            return (
              <Link key={user.id} to={`/user/${user.id}`} className="flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition">
                <img 
                  src={getAvatar(user.fullName, seeker.avatar)} // JSON trả về 'avatar'
                  alt="Avatar" 
                  className="h-10 w-10 rounded-full border object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 truncate">
                      {user.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{seeker.headline || 'Thành viên VIP'}</p>
                </div>
              </Link>
            );
          }) : (
             <p className="text-xs text-gray-400 italic text-center">Đang cập nhật danh sách...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSuggestions;