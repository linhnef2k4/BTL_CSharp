import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Users } from 'lucide-react';

// Dữ liệu "giả" (sau này bạn "lấy" (get) "từ" (from) API)
const mockJobs = [
  { id: 1, title: 'Senior React Developer', applicants: 12, status: 'Đang đăng' },
  { id: 2, title: '.NET Developer (Fresher)', applicants: 58, status: 'Đang đăng' },
  { id: 3, title: 'UI/UX Designer', applicants: 5, status: 'Sắp hết hạn' },
];

const JobsOverview = () => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-lg">
      
      {/* Header Card (Tiêu đề + Link "Quản lý") */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Briefcase size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">Job đang đăng</h3>
        </div>
        <Link 
          to="/employer/manage-jobs" // <-- "CHÌA KHÓA": Trỏ đến trang Kanban "xịn"
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:underline"
        >
          <span>Quản lý</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* List Jobs */}
      <ul className="space-y-3">
        {mockJobs.map(job => (
          <li key={job.id}>
            {/* Click vào "cũng" (also) "bay" (navigate) "đến" (to) "trang" (page) "Kanban" (Kanban) */}
            <Link 
              to="/employer/manage-jobs" 
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
            >
              {/* Bên trái: Tên Job + Status */}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  job.status === 'Sắp hết hạn' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {job.status}
                </span>
              </div>
              
              {/* Bên phải: Số lượng Ứng viên (quan trọng) */}
              <div className="flex flex-shrink-0 items-center space-x-1.5 text-sm text-gray-600">
                <Users size={14} />
                <span className="font-semibold">{job.applicants}</span>
                <span className="hidden sm:inline">ứng viên</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobsOverview;