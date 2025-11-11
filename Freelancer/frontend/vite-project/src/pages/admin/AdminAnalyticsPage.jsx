import React, { useState } from 'react';
import { motion } from 'framer-motion';

// "Import" (Import) "TẤT CẢ" (ALL) "các" (the) "linh kiện" (components) "Biểu đồ" (Chart) "chúng ta" (we) "đã" (already) "làm" (built)
import AdminStatCard from '../../components/admin/AdminStatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import RevenueBreakdownPie from '../../components/admin/RevenueBreakdownPie'; // <-- File 1/3 "mới" (new) "của" (of) "bạn" (you)

// "Import" (Import) "icons" (icons) "cho" (for) "Stats" (Stats) "mới" (new)
import { DollarSign, UserCheck, BarChart, Calendar } from 'lucide-react';

// "Component" (Component) "con" (child) "cho" (for) "nút" (button) "Filter" (Filter) "Thời gian" (Time)
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-200
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg' // Style "Active" (Active)
        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border' // Style "Thường" (Normal)
      }`}
  >
    {label}
  </button>
);

/**
 * Đây là "Trang" (Page) "THỐNG KÊ" (ANALYTICS) "XỊN" (PRO) "THẬT SỰ" (REAL)
 */
const AdminAnalyticsPage = () => {
  
  // "BỘ NÃO" (BRAIN) "Quản lý" (Manage) "Filter" (Filter) "Thời gian" (Time)
  const [activeFilter, setActiveFilter] = useState('month'); // 'day', 'week', 'month'

  // "Data" (Data) "giả" (mock) "cho" (for) "các" (the) "ô" (boxes) "Stats" (Stats)
  // (Nó "sẽ" (will) "thay đổi" (change) "theo" (based on) "filter" (filter) "sau" (later) "này" (on))
  const stats = {
    revenue: { title: 'Tổng Doanh thu', value: '16.000k', change: '+12.5%', isPositive: true, icon: <DollarSign />, bgColor: 'bg-green-500' },
    newVips: { title: 'VIP Mới', value: '180', change: '+8.0%', isPositive: true, icon: <UserCheck />, bgColor: 'bg-blue-500' },
    avgRevenue: { title: 'Doanh thu / User', value: '88k', change: '-2.1%', isPositive: false, icon: <BarChart />, bgColor: 'bg-yellow-500' },
  };

  // "Animation" (Animation) "cho" (for) "các" (the) "card" (cards)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, 
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
      {/* 1. "Header" (Header) "Trang" (Page) (Tiêu đề "và" (and) "Bộ lọc" (Filter) "Thời gian" (Time)) */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Thống kê Doanh thu
        </h1>
        {/* "Bộ" (Set) "lọc" (filter) "Thời gian" (Time) "xịn" (pro) */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0 p-1 bg-gray-100 rounded-lg">
          <Calendar size={18} className="text-gray-500 ml-2" />
          <FilterButton label="Hôm nay" isActive={activeFilter === 'day'} onClick={() => setActiveFilter('day')} />
          <FilterButton label="Tuần này" isActive={activeFilter === 'week'} onClick={() => setActiveFilter('week')} />
          <FilterButton label="Tháng này" isActive={activeFilter === 'month'} onClick={() => setActiveFilter('month')} />
        </div>
      </motion.div>

      {/* 2. "Grid" (Grid) "3" (Three) "Ô" (Boxes) "Thống kê" (Stats) (Dùng "File 1/4" "cũ" (old)) */}
      <motion.div 
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.revenue} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.newVips} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AdminStatCard {...stats.avgRevenue} />
        </motion.div>
      </motion.div>

      {/* 3. "Grid" (Grid) "2" (Two) "Cột" (Columns) "Biểu đồ" (Charts) */}
      <motion.div 
        className="grid grid-cols-1 gap-6 lg:grid-cols-3" 
        variants={containerVariants}
      >
        
        {/* CỘT 1 (To): "BIỂU ĐỒ" (CHART) "LINE" (LINE) (Dùng "File 2/4" "cũ" (old)) */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <RevenueChart />
        </motion.div>

        {/* CỘT 2 (Nhỏ): "BIỂU ĐỒ" (CHART) "TRÒN" (PIE) (Dùng "File 1/3" "MỚI" (NEW)) */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <RevenueBreakdownPie />
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default AdminAnalyticsPage;