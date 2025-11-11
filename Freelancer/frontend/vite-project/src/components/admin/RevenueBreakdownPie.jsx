import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "BIỂU ĐỒ" (CHART) "TRÒN" (PIE) ---
const pieData = [
  { name: 'VIP Employer', value: 12200000 },
  { name: 'VIP Seeker', value: 3800000 },
];

// "Màu" (Colors) "cho" (for) "biểu đồ" (chart)
const COLORS = ['#3b82f6', '#f97316']; // "Xanh" (Blue) (cho "Employer" (Employer)), "Cam" (Orange) (cho "Seeker" (Seeker))
// ------------------------------------

/**
 * Đây là "Card" (Card) "chứa" (containing) "Biểu đồ" (Chart) "Tròn" (Pie) "Phân bổ" (Distribution) "Doanh thu" (Revenue)
 */
const RevenueBreakdownPie = () => {

  // "Hàm" (Function) "để" (to) "format" (format) "cái" (the) "Tooltip" (Tooltip) "khi" (when) "di" (hover) "chuột" (mouse)
  const formatTooltipValue = (value) => {
    return `${value.toLocaleString()} VNĐ`;
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Phân bổ Doanh thu
      </h3>
      
      {/* "Container" (Container) "Responsive" (Responsive) */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer >
          <PieChart>
            {/* "Cái" (The) "Bánh" (Pie) "Tròn" (Chart) */}
            <Pie
              data={pieData}
              cx="50%" // "Căn" (Align) "giữa" (center) "ngang" (horizontally)
              cy="50%" // "Căn" (Align) "giữa" (center) "dọc" (vertically)
              innerRadius={80} // "Làm" (Make) "cho" (it) "nó" (it) "thành" (a) "Donut" (Donut) "Chart" (Chart) (cho "đẹp" (pretty))
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={5} // "Khoảng" (Space) "cách" (padding) "giữa" (between) "2" (two) "miếng" (slices)
              dataKey="value" // "Lấy" (Get) "giá trị" (value) "từ" (from) "key" (key) "value" (value) "của" (of) "data" (data)
            >
              {/* "Tô" (Fill) "màu" (color) "cho" (for) "từng" (each) "miếng" (slice) */}
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
            {/* "Tooltip" (Tooltip) "khi" (when) "di" (hover) "chuột" (mouse) */}
            <Tooltip formatter={formatTooltipValue} />
            
            {/* "Chú thích" (Legend) (ở "dưới" (bottom)) */}
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueBreakdownPie;