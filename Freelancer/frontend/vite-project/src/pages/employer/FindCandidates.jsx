import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search } from 'lucide-react';

// Import "3 cái" (3) "linh kiện" (components) "ta" (we) "vừa" (just) "làm" (built)
import CandidateFilter from '../../components/employer/CandidateFilter';
import CandidateCard from '../../components/employer/CandidateCard';
import RecommendedCandidates from '../../components/employer/RecommendedCandidates';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
// (Nó "phải" (must) "khớp" (match) "với" (with) "các" (the) "bộ lọc" (filters))
const MOCK_CANDIDATES = [
  { id: 'c1', name: 'Minh Tuấn (VIP)', avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan', title: 'Senior React Dev', location: 'Hà Nội', level: 'Senior', skills: ['React', 'Node.js', 'Tailwind'], isVip: true },
  { id: 'c2', name: 'Ngọc Ánh', avatar: 'https://ui-avatars.com/api/?name=Ngoc+Anh', title: 'Fresher .NET Dev', location: 'Hồ Chí Minh', level: 'Fresher', skills: ['.NET', 'SQL Server', 'C#'], isVip: false },
  { id: 'c3', name: 'Khánh Linh', avatar: 'https://ui-avatars.com/api/?name=Khanh+Linh', title: 'Junior UI/UX Designer', location: 'Đà Nẵng', level: 'Junior', skills: ['Figma', 'Photoshop', 'UI/UX'], isVip: false },
  { id: 'c4', name: 'Văn Đức Trung', avatar: 'https://ui-avatars.com/api/?name=Van+Trung', title: 'Senior React Dev', location: 'Hà Nội', level: 'Senior', skills: ['React', 'TypeScript', 'AWS'], isVip: false },
  { id: 'c5', name: 'Hồng Trâm', avatar: 'https://ui-avatars.com/api/?name=Hong+Tram', title: 'Junior Tester', location: 'Hồ Chí Minh', level: 'Junior', skills: ['Manual Test', 'Selenium', 'SQL'], isVip: false },
];
// ------------------------------------

const FindCandidates = () => {
  // --- "BỘ NÃO" (BRAIN) ---
  const [allCandidates] = useState(MOCK_CANDIDATES);
  const [filteredCandidates, setFilteredCandidates] = useState(MOCK_CANDIDATES);
  
  // "CẦU DAO" (SWITCH) "ĐỂ" (TO) "TEST" (TEST) "LOGIC" (LOGIC) "VIP" (VIP)
  // (Bạn "hãy" (please) "thử" (try) "click" (clicking) "cái" (this) "nút" (button) "này" (this) "trên" (on) "giao diện" (UI))
  const [isVip, setIsVip] = useState(false); 

  // "HÀM" (FUNCTION) "LỌC" (FILTER) "LOGIC" (LOGIC) "THẬT" (REAL)
  const handleApplyFilters = (filters) => {
    let tempCandidates = [...allCandidates];

    // 1. Lọc "Kỹ năng" (Skills)
    if (filters.skills?.length > 0) {
      tempCandidates = tempCandidates.filter(c => 
        // "Phải" (Must) "có" (have) "TẤT CẢ" (ALL) "các" (the) "kỹ năng" (skills) "đã" (been) "nhập" (entered)
        filters.skills.every(skill => 
          c.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // 2. Lọc "Địa điểm" (Location)
    if (filters.location) {
      tempCandidates = tempCandidates.filter(c => 
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // 3. Lọc "Cấp bậc" (Level)
    if (filters.levels?.length > 0) {
      tempCandidates = tempCandidates.filter(c => filters.levels.includes(c.level));
    }
    
    // "Cập nhật" (Update) "lại" (again) "danh sách" (list) "hiển thị" (display)
    setFilteredCandidates(tempCandidates);
  };
  
  // "Tách" (Separate) "danh sách" (list) "VIP" (VIP) "ra" (out) "để" (to) "đề xuất" (recommend)
  const recommendedList = allCandidates.filter(c => c.isVip);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm Ứng viên</h1>

      {/* "CẦU DAO" (SWITCH) "TEST" (TEST) "VIP" (VIP) (God Mode) */}
      <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
        <label htmlFor="vipToggle" className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            id="vipToggle"
            checked={isVip}
            onChange={() => setIsVip(prev => !prev)}
            className="h-4 w-4 rounded text-yellow-500 focus:ring-yellow-400"
          />
          <span className="ml-2 font-semibold text-yellow-700">
            [God Mode] Bật/Tắt chế độ VIP (để test "Mồi câu")
          </span>
        </label>
      </div>

      {/* Layout 2 Cột (Lọc "trái" (left), Kết quả "phải" (right)) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        
        {/* CỘT 1: LỌC (Dùng "File 1/5") */}
        <aside className="lg:col-span-1">
          <CandidateFilter onApplyFilters={handleApplyFilters} />
        </aside>

        {/* CỘT 2: KẾT QUẢ (Dùng "File 2/5" & "File 3/5") */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* 1. KHUNG "MỒI CÂU" (BAIT) "VIP" (VIP) (Dùng "File 3/5") */}
          <RecommendedCandidates 
            isVip={isVip} 
            candidates={recommendedList} 
          />

          {/* 2. KẾT QUẢ "THƯỜNG" (REGULAR) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Tìm thấy {filteredCandidates.length} ứng viên
            </h3>
            <div className="space-y-4">
              <AnimatePresence>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map(candidate => (
                    <motion.div
                      key={candidate.id}
                      layout // <-- "Animation" (Animation) "thần thánh" (divine) "khi" (when) "lọc" (filtering)
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* "Vẽ" (Render) "cái" (the) "Thẻ" (Card) (Dùng "File 2/5") */}
                      <CandidateCard candidate={candidate} />
                    </motion.div>
                  ))
                ) : (
                  // "Nếu" (If) "không" (not) "tìm" (find) "thấy" (any)
                  <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                    <Search size={40} className="mx-auto text-gray-400" />
                    <h3 className="text-xl font-semibold mt-2">Không tìm thấy ứng viên</h3>
                    <p className="text-gray-500">Vui lòng thử thay đổi từ khóa hoặc bộ lọc.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default FindCandidates;