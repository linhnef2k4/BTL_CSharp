import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, BarChart3, Brain } from 'lucide-react';

// Component "con" (child) "cho" (for) "checkbox" (checkbox) (Dùng "lại" (reuse))
const FilterCheckbox = ({ id, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor={id} className="ml-3 text-sm text-gray-700">
      {label}
    </label>
  </div>
);

/**
 * Đây là "cột" (column) "lọc" (filter) "ứng viên" (candidates)
 * @param {object} props
 * @param {function} props.onApplyFilters - "Hàm" (Function) "để" (to) "báo cáo" (report) "lên" (up) "cho" (to) "cha" (parent)
 */
const CandidateFilter = ({ onApplyFilters }) => {
  // "Bộ não" (Brain) "nội bộ" (internal) "của" (of) "cái" (this) "filter" (filter)
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [levels, setLevels] = useState(new Set());

  // "Hàm" (Function) "xử lý" (handle) "check/uncheck" (check/uncheck) "cho" (for) "cấp bậc" (level)
  const handleCheckboxChange = (value) => {
    setLevels(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(value)) newSet.delete(value); // "Bỏ" (Uncheck) "check" (check)
      else newSet.add(value); // "Check" (Check) "vào" (it)
      return newSet;
    });
  };

  // "Khi" (When) "bấm" (click) "Áp dụng" (Apply)
  const handleApply = () => {
    // "Báo cáo" (Report) "lên" (up) "cha" (parent)
    onApplyFilters({
      skills: skills.split(',').map(s => s.trim()).filter(Boolean), // "Tách" (Split) "React, Node" "thành" (into) ["React", "Node"]
      location,
      levels: Array.from(levels), // "Chuyển" (Convert) "Set" (Set) "thành" (into) "Mảng" (Array)
    });
  };

  // "Khi" (When) "bấm" (click) "Xóa" (Clear)
  const handleClear = () => {
    setSkills('');
    setLocation('');
    setLevels(new Set());
    onApplyFilters({}); // "Báo cáo" (Report) "1" (one) "cái" (an) "object" (object) "rỗng" (empty)
  };

  return (
    <div className="sticky top-20 space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold">Lọc Ứng Viên</h3>
          <SlidersHorizontal size={20} className="text-gray-500" />
        </div>

        <div className="space-y-4 divide-y divide-gray-100 pt-4">
          
          {/* Lọc 1: Kỹ năng (quan trọng "nhất" (most)) */}
          <details className="group" open>
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Kỹ năng</span>
              <Brain size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="VD: React, .NET, Figma..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400">Cách nhau bằng dấu phẩy (,)</p>
            </div>
          </details>

          {/* Lọc 2: Địa điểm */}
          <details className="group pt-4" open>
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Địa điểm</span>
              <MapPin size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="VD: Hà Nội, Hồ Chí Minh..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </details>

          {/* Lọc 3: Cấp bậc */}
          <details className="group pt-4" open>
            <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
              <span>Cấp bậc</span>
              <BarChart3 size={16} />
            </summary>
            <div className="mt-3 space-y-2">
              {/* "Value" (Value) "phải" (must) "khớp" (match) "với" (with) "data" (data) "của" (of) "Seeker" (Seeker) */}
              <FilterCheckbox id="level-fresher" label="Fresher" checked={levels.has('Fresher')} onChange={() => handleCheckboxChange('Fresher')} />
              <FilterCheckbox id="level-junior" label="Junior" checked={levels.has('Junior')} onChange={() => handleCheckboxChange('Junior')} />
              <FilterCheckbox id="level-senior" label="Senior" checked={levels.has('Senior')} onChange={() => handleCheckboxChange('Senior')} />
            </div>
          </details>

        </div>

        {/* Nút bấm "Lọc" (Filter) */}
        <div className="mt-6 flex space-x-2 border-t pt-4">
          <button onClick={handleClear} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Xóa lọc
          </button>
          <button onClick={handleApply} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFilter;