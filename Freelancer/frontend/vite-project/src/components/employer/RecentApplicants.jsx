import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

// Dữ liệu "giả" (sau này bạn "lấy" (get) "từ" (from) API)
const mockApplicants = [
  { id: 1, name: 'Minh Tuấn (Seeker)', avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan', job: 'Senior React Developer', time: '30 phút trước' },
  { id: 2, name: 'Ngọc Ánh', avatar: 'https://ui-avatars.com/api/?name=Ngoc+Anh', job: '.NET Developer (Fresher)', time: '1 giờ trước' },
  { id: 3, name: 'Văn Đức Trung', avatar: 'https://ui-avatars.com/api/?name=Van+Trung', job: 'Senior React Developer', time: '3 giờ trước' },
];

const RecentApplicants = () => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-lg">
      
      {/* Header Card (Tiêu đề + Link "Xem tất cả") */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">Ứng viên mới</h3>
        </div>
        <Link 
          to="/employer/manage-jobs" // <-- "CHÌA KHÓA": Trỏ đến trang Kanban "xịn"
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:underline"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* List Ứng viên */}
      <ul className="space-y-3">
        {mockApplicants.map(applicant => (
          <li key={applicant.id}>
            {/* Click vào sẽ "bay" (navigate) "đến" (to) "profile" (profile) "của" (of) "Seeker" (seeker) (Logic "giả" (mock) "thôi" (only)) */}
            <Link 
              to={`/profile/${applicant.name.toLowerCase().replace(' ', '-')}`} 
              className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
            >
              <img src={applicant.avatar} alt={applicant.name} className="h-10 w-10 rounded-full" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {applicant.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  vừa ứng tuyển vào <span className="font-medium text-gray-600">{applicant.job}</span>
                </p>
              </div>
              <span className="text-xs text-gray-400">{applicant.time}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentApplicants;