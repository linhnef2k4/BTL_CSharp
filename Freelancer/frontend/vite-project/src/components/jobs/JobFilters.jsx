import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, DollarSign, BarChart3, Clock } from 'lucide-react';

// Danh sách tỉnh/thành (và 'Remote')
const PROVINCE_LIST = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Remote', // Thêm 'Remote' vào đây để lọc chung
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cần Thơ',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hải Phòng',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];


// Component con cho checkbox
const FilterCheckbox = ({ id, label, checked, onChange }) => (
  <div className="flex items-center px-2">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor={id} className="ml-3 block w-full cursor-pointer py-1 text-sm text-gray-700">
      {label}
    </label>
  </div>
);

// Component Filter chính
const JobFilters = ({ onApplyFilters }) => {
  const [salaries, setSalaries] = useState(new Set());
  const [levels, setLevels] = useState(new Set());
  const [types, setTypes] = useState(new Set());
  
  // --- STATE MỚI CHO ĐỊA ĐIỂM ---
  const [locations, setLocations] = useState(new Set());
  const [locationSearch, setLocationSearch] = useState('');
  // ---------------------------------

  const handleCheckboxChange = (stateSetter, value) => {
    stateSetter(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  // Nâng cấp để gửi cả locations
  const handleApply = () => {
    onApplyFilters({
      locations: Array.from(locations), // <-- MỚI
      salaries: Array.from(salaries),
      levels: Array.from(levels),
      types: Array.from(types),
    });
  };

  // Nâng cấp để xóa cả locations
  const handleClear = () => {
    setLocations(new Set()); // <-- MỚI
    setSalaries(new Set());
    setLevels(new Set());
    setTypes(new Set());
    setLocationSearch(''); // <-- MỚI
    onApplyFilters({});
  };

  // Lọc danh sách tỉnh/thành dựa trên (locationSearch)
  const filteredProvinces = PROVINCE_LIST.filter(p => 
    p.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="sticky top-20 space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
        {/* ... Header (giữ nguyên) ... */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold">Bộ lọc</h3>
          <SlidersHorizontal size={20} className="text-gray-500" />
        </div>

        <div className="space-y-4 divide-y divide-gray-100 pt-4">
          
          {/* Lọc 1: Địa điểm (ĐÃ NÂNG CẤP "XỊN") */}
          <details className="group" open>
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Địa điểm</span>
              <MapPin size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              {/* Ô Search (cho "nhập") */}
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Tìm thành phố..."
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {/* Danh sách (cho "tránh dài") */}
              <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                {filteredProvinces.map((province) => (
                  <FilterCheckbox 
                    key={province}
                    id={`loc-${province}`} 
                    label={province}
                    checked={locations.has(province)}
                    onChange={() => handleCheckboxChange(setLocations, province)}
                  />
                ))}
              </div>
            </div>
          </details>

          {/* ... (Các bộ lọc Lương, Cấp bậc, Hình thức giữ nguyên) ... */}
          {/* Lọc 2: Mức lương */}
          <details className="group pt-4" open>
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Mức lương</span>
              <DollarSign size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              <FilterCheckbox id="salary-1" label="5 - 10 triệu" checked={salaries.has('5-10')} onChange={() => handleCheckboxChange(setSalaries, '5-10')} />
              <FilterCheckbox id="salary-2" label="10 - 20 triệu" checked={salaries.has('10-20')} onChange={() => handleCheckboxChange(setSalaries, '10-20')} />
              <FilterCheckbox id="salary-3" label="20 - 30 triệu" checked={salaries.has('20-30')} onChange={() => handleCheckboxChange(setSalaries, '20-30')} />
              <FilterCheckbox id="salary-4" label="Trên 30 triệu" checked={salaries.has('30')} onChange={() => handleCheckboxChange(setSalaries, '30')} />
            </div>
          </details>

          {/* Lọc 3: Cấp bậc */}
          <details className="group pt-4">
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Cấp bậc</span>
              <BarChart3 size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              <FilterCheckbox id="level-1" label="Fresher" checked={levels.has('Fresher')} onChange={() => handleCheckboxChange(setLevels, 'Fresher')} />
              <FilterCheckbox id="level-2" label="Junior" checked={levels.has('Junior')} onChange={() => handleCheckboxChange(setLevels, 'Junior')} />
              <FilterCheckbox id="level-3" label="Senior" checked={levels.has('Senior')} onChange={() => handleCheckboxChange(setLevels, 'Senior')} />
              <FilterCheckbox id="level-4" label="Lead" checked={levels.has('Lead')} onChange={() => handleCheckboxChange(setLevels, 'Lead')} />
            </div>
          </details>

          {/* Lọc 4: Hình thức */}
          <details className="group pt-4">
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Hình thức</span>
              <Clock size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              <FilterCheckbox id="type-1" label="Full-time" checked={types.has('Full-time')} onChange={() => handleCheckboxChange(setTypes, 'Full-time')} />
              <FilterCheckbox id="type-2" label="Part-time" checked={types.has('Part-time')} onChange={() => handleCheckboxChange(setTypes, 'Part-time')} />
              <FilterCheckbox id="type-3" label="Remote (Từ xa)" checked={types.has('Remote')} onChange={() => handleCheckboxChange(setTypes, 'Remote')} />
            </div>
          </details>
        </div>

        {/* Nút bấm (Đã nâng cấp) */}
        <div className="mt-6 flex space-x-2 border-t pt-4">
          <button 
            onClick={handleClear}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Xóa lọc
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;