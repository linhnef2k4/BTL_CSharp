import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Line 
} from 'recharts';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "BIỂU ĐỒ" (CHART) ---
const revenueData = [
  { name: 'Tháng 1', "VIP Employer": 4000, "VIP Seeker": 2400 },
  { name: 'Tháng 2', "VIP Employer": 3000, "VIP Seeker": 1398 },
  { name: 'Tháng 3', "VIP Employer": 2000, "VIP Seeker": 9800 },
  { name: 'Tháng 4', "VIP Employer": 2780, "VIP Seeker": 3908 },
  { name: 'Tháng 5', "VIP Employer": 1890, "VIP Seeker": 4800 },
  { name: 'Tháng 6', "VIP Employer": 2390, "VIP Seeker": 3800 },
  { name: 'Tháng 7', "VIP Employer": 3490, "VIP Seeker": 4300 },
  { name: 'Tháng 8', "VIP Employer": 4100, "VIP Seeker": 5200 },
  { name: 'Tháng 9', "VIP Employer": 5200, "VIP Seeker": 6100 },
  { name: 'Tháng 10', "VIP Employer": 4800, "VIP Seeker": 5500 },
  { name: 'Tháng 11', "VIP Employer": 5300, "VIP Seeker": 6400 },
  { name: 'Tháng 12', "VIP Employer": 6100, "VIP Seeker": 7200 },
];
// ------------------------------------

/**
 * Đây là "Card" (Card) "chứa" (containing) "Biểu đồ" (Chart) "Doanh thu" (Revenue)
 */
const RevenueChart = () => {
  // "Hàm" (Function) "để" (to) "format" (format) "cái" (the) "số" (number) "trên" (on) "trục" (axis) "Y" (Y) "cho" (to be) "nó" (it) "đẹp" (pretty)
  const formatYAxis = (tickItem) => {
    // "Biến" (Convert) "8000" "thành" (into) "8.000k"
    return `${(tickItem / 1000).toLocaleString()}k`;
  };
  
  // "Hàm" (Function) "để" (to) "format" (format) "cái" (the) "Tooltip" (Tooltip) "khi" (when) "di" (hover) "chuột" (mouse)
  const formatTooltipValue = (value) => {
    return `${value.toLocaleString()} VNĐ`;
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tổng quan Doanh thu (Gói VIP)
      </h3>
      
      {/* "Container" (Container) "Responsive" (Responsive) (Quan trọng "nhất" (most)) */}
      {/* "Nó" (It) "sẽ" (will) "tự động" (automatically) "co giãn" (resize) "theo" (with) "card" (card) "cha" (parent) */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart
            data={revenueData}
            margin={{
              top: 5,
              right: 20,
              left: 20, // "Tăng" (Increase) "khoảng" (space) "cách" (padding) "bên trái" (left) "cho" (for) "trục" (axis) "Y" (Y)
              bottom: 5,
            }}
          >
            {/* "Lưới" (Grid) "nền" (background) */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            {/* "Trục" (Axis) "X" (X) (Tên "các" (the) "tháng" (months)) */}
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
            
            {/* "Trục" (Axis) "Y" (Y) (Doanh thu) (Dùng "hàm" (function) "format" (format) "ở" (at) "trên" (above)) */}
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
            
            {/* "Tooltip" (Tooltip) "khi" (when) "di" (hover) "chuột" (mouse) (Dùng "hàm" (function) "format" (format) "ở" (at) "trên" (above)) */}
            <Tooltip formatter={formatTooltipValue} />
            
            {/* "Chú thích" (Legend) (ở "dưới" (bottom)) */}
            <Legend verticalAlign="bottom" height={36}/>
            
            {/* "Đường" (Line) "1" (One): "VIP Employer" (VIP Employer) (Màu "xanh" (blue)) */}
            <Line 
              type="monotone" 
              dataKey="VIP Employer" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
            />
            {/* "Đường" (Line) "2" (Two): "VIP Seeker" (VIP Seeker) (Màu "cam" (orange)) */}
            <Line 
              type="monotone" 
              dataKey="VIP Seeker" 
              stroke="#f97316" 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;