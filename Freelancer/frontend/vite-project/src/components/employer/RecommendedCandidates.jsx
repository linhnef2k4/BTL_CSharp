import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';
import CandidateCard from './CandidateCard'; // "Import" (Import) "File 2/5" (File 2/5) "để" (to) "dùng" (use) "khi" (when) "ĐÃ" (IS) "VIP" (VIP)

/**
 * Đây là "khung" (box) "Đề xuất" (Recommendation) "thông minh" (smart) (Freemium)
 * @param {object} props
 * @param {boolean} props.isVip - "Trạng thái" (Status) "VIP" (VIP) "của" (of) "Employer" (Employer)
 * @param {Array} props.candidates - "Danh sách" (List) "ứng viên" (candidates) "xịn" (pro) "để" (to) "hiển thị" (display) "nếu" (if) "là" (is) "VIP" (VIP)
 */
const RecommendedCandidates = ({ isVip, candidates }) => {
  
  // --- TRƯỜNG HỢP 1: NẾU (IF) "LÀ" (IS) "VIP" (VIP) (Đã "trả" (paid) "tiền" (money)) ---
  if (isVip) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-lg ring-2 ring-yellow-400">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-600 mb-3">
          <Star size={20} fill="currentColor" />
          Ứng viên Tiềm năng (Đã mở khóa)
        </h3>
        {/* "Vẽ" (Render) "ra" (out) "các" (the) "card" (cards) "ứng viên" (candidate) "xịn" (pro) "thật" (real) */}
        <div className="space-y-4">
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 2: NẾU (IF) "LÀ" (IS) "THƯỜNG" (FREE) (Cái "Mồi câu" (Bait)) ---
  return (
    <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center shadow-inner overflow-hidden">
      
      {/* 1. Lớp "Nội dung" (Content) "giả" (fake) "bị" (is) "mờ" (blurred) "ở" (at) "dưới" (bottom) */}
      <div className="blur-sm opacity-50 select-none">
        <div className="h-10 w-full bg-gray-200 rounded-md mb-3"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md mb-3"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
      </div>

      {/* 2. Lớp "Nội dung" (Content) "Bị Khóa" (Locked) "nằm" (sit) "đè" (on top) "lên" (it) "trên" (above) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 p-4">
        <div className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-3 text-white shadow-lg">
          <Lock size={28} />
        </div>
        <h3 className="mt-3 text-xl font-bold text-gray-800">
          Đề xuất Ứng viên Tiềm năng
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-xs">
          Nâng cấp VIP để xem danh sách ứng viên phù hợp nhất do AI đề xuất!
        </p>
        <Link
          to="/employer/vip-package" // "Link" (Link) "đến" (to) "trang" (page) "bán" (sell) "Gói VIP" (VIP Package)
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2.5 
                     font-semibold text-white shadow-lg transition-all hover:scale-105"
        >
          <Star size={16} />
          Nâng cấp VIP để Mở khóa
        </Link>
      </div>
    </div>
  );
};

export default RecommendedCandidates;