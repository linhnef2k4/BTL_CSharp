import React from 'react';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

// Import "3 cái" (3) "linh kiện" (components) "xịn" (pro) "ta" (we) "vừa" (just) "làm" (built)
import StatCard from '../../components/employer/StatCard';
import RecentApplicants from '../../components/employer/RecentApplicants';
import JobsOverview from '../../components/employer/JobsOverview';

// Dữ liệu "giả" (sau này bạn "lấy" (get) "từ" (from) API)
const employerStats = {
  activeJobs: '3',
  newApplicants: '71',
  views: '12,8K',
};

const EmployerDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. Header (Chào mừng) */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại, FPT Software!
        </h1>
        <p className="mt-1 text-gray-600">
          Đây là "tổng quan" (overview) "nhanh" (quick) "về" (about) "hoạt động" (activity) "của" (of) "bạn" (you).
        </p>
      </div>

      {/* 2. Grid (Lưới) "Thống kê" (Stats) (Dùng "File 1/5") */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Job đang đăng"
          value={employerStats.activeJobs}
          icon={<Briefcase />}
        />
        <StatCard 
          title="Hồ sơ mới (Tuần)"
          value={employerStats.newApplicants}
          icon={<Users />}
          change="+12.5%"
          changeType="positive"
        />
        <StatCard 
          title="Lượt xem (Tháng)"
          value={employerStats.views}
          icon={<TrendingUp />}
          change="+8.1%"
          changeType="positive"
        />
      </div>

      {/* 3. Grid (Lưới) "Hoạt động" (Activity) (Dùng "File 2/5" & "File 3/5") */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Cột "Job" (to hơn) (Dùng "File 3/5") */}
        <div className="lg:col-span-2">
          <JobsOverview />
        </div>

        {/* Cột "Ứng viên" (nhỏ hơn) (Dùng "File 2/5") */}
        <div className="lg:col-span-1">
          <RecentApplicants />
        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;