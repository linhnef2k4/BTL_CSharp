import React from 'react';
import { motion } from 'framer-motion';
// "Import" (Import) "2" (two) "cái" (the) "linh kiện" (components) "xịn" (pro) "ta" (we) "vừa" (just) "làm" (built)
import AdminStatCard from '../../components/admin/AdminStatCard';
import RevenueChart from '../../components/admin/RevenueChart';

// "Import" (Import) "icons" (icons) "cho" (for) "4" (four) "cái" (the) "thẻ" (cards) "Stats" (Stats)
// --- "FIX" (FIX) "LÀ" (IS) "Ở" (AT) "ĐÂY" (HERE) ---
import { 
  DollarSign, 
  UserCheck, 
  FileCheck, 
  MessageSquare, 
  AlertTriangle // <-- "TÔI" (I) "ĐÃ" (HAVE) "THÊM" (ADDED) "NÓ" (IT) "VÀO" (INTO) "ĐÂY" (HERE) "RỒI" (ALREADY) "NÈ" (LOOK)!
} from 'lucide-react';
// --- "HẾT" (END) "FIX" (FIX) ---

/**
 * Đây là "Trang" (Page) "TỔNG QUAN" (DASHBOARD) "XỊN" (PRO) "THẬT SỰ" (REAL)
 */
const AdminDashboard = () => {
  
  // "Data" (Data) "giả" (mock) "cho" (for) "các" (the) "ô" (boxes) "Stats" (Stats)
  const stats = {
    revenue: { title: 'Tổng Doanh thu (Tháng)', value: '12.200k', change: '+15.2%', isPositive: true, icon: <DollarSign />, bgColor: 'bg-green-500' },
    newUsers: { title: 'User Mới (Tháng)', value: '1.250', change: '+10.1%', isPositive: true, icon: <UserCheck />, bgColor: 'bg-blue-500' },
    jobsPending: { title: 'Job Chờ duyệt', value: '42', change: '+5', isPositive: false, icon: <FileCheck />, bgColor: 'bg-yellow-500' },
    supportTickets: { title: 'Hỗ trợ Chờ', value: '8', change: '+2', isPositive: false, icon: <MessageSquare />, bgColor: 'bg-red-500' },
  };

  // "Animation" (Animation) "cho" (for) "các" (the) "card" (cards) "nó" (it) "bay" (fly) "vào" (in) "cho" (to be) "đẹp" (pretty)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // "Mỗi" (Each) "đứa" (child) "con" (child) "cách" (delay) "nhau" (by) "0.1s" (0.1s)
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. "Tiêu đề" (Title) "Trang" (Page) */}
      <motion.h1 
        className="text-3xl font-bold text-gray-900" 
        variants={itemVariants}
      >
        Tổng quan Admin
      </motion.h1>

      {/* 2. "Grid" (Grid) "4" (Four) "Ô" (Boxes) "Thống kê" (Stats) (Dùng "File 1/4") */}
      <motion.div 
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants} 
      >
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.revenue} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.newUsers} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.jobsPending} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.supportTickets} />
        </motion.div>
      </motion.div>

      {/* 3. "Grid" (Grid) "2" (Two) "Cột" (Columns) "Nội dung" (Content) "Chính" (Main) */}
      <motion.div 
        className="grid grid-cols-1 gap-6 lg:grid-cols-3" 
        variants={itemVariants}
      >
        
        {/* CỘT 1 (To): "BIỂU ĐỒ" (CHART) "DOANH THU" (REVENUE) (Dùng "File 2/4") */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* CỘT 2 (Nhỏ): "HOẠT ĐỘNG" (ACTIVITY) "GẦN ĐÂY" (RECENT) */}
        <div className="rounded-xl bg-white p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Hoạt động Gần đây
          </h3>
          <ul className="space-y-3 max-h-[350px] overflow-y-auto">
            <li className="flex items-center space-x-3">
              <span className="rounded-full bg-blue-100 p-2 text-blue-600"><UserCheck size={16}/></span>
              <p className="text-sm text-gray-600"><strong>Employer "FPT"</strong> vừa được <span className="font-bold">Duyệt</span>.</p>
            </li>
            <li className="flex items-center space-x-3">
              <span className="rounded-full bg-green-100 p-2 text-green-600"><DollarSign size={16}/></span>
              <p className="text-sm text-gray-600"><strong>Minh Tuấn (VIP)</strong> vừa <span className="font-bold">Thanh toán</span> 99k.</p>
            </li>
            <li className="flex items-center space-x-3">
              {/* "CÁI" (THE) "NÀY" (THIS) "LÀ" (IS) "NGUYÊN NHÂN" (THE CAUSE) "GÂY" (OF THE) "LỖI" (BUG) "NÈ" (LOOK)! */}
              <span className="rounded-full bg-red-100 p-2 text-red-600"><AlertTriangle size={16}/></span>
              <p className="text-sm text-gray-600">Bài post "Test" bị <strong>Báo cáo</strong> (5 lần).</p>
            </li>
            <li className="flex items-center space-x-3">
              <span className="rounded-full bg-yellow-100 p-2 text-yellow-600"><FileCheck size={16}/></span>
              <p className="text-sm text-gray-600">Job "React Dev" đang <strong>Chờ duyệt</strong>.</p>
            </li>
          </ul>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;