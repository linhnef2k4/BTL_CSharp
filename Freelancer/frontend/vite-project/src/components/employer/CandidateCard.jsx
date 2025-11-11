import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, MapPin, Brain, Star } from 'lucide-react';

/**
 * Đây là 1 "Card" (thẻ) "hiển thị" (display) "thông tin" (info) "1" (one) "Ứng viên" (Candidate)
 * @param {object} props
 * @param {object} props.candidate - Dữ liệu "giả" (mock data) "của" (of) "ứng viên" (candidate)
 */
const CandidateCard = ({ candidate }) => {
  return (
    <motion.div
      className="rounded-xl border bg-white shadow-md transition-all duration-300"
      whileHover={{ y: -5, shadow: 'rgba(0, 0, 0, 0.1) 0px 10px 20px' }} // "Nổi" (Pop) "lên" (up) "khi" (when) "hover" (hover)
    >
      <div className="p-5">
        {/* 1. Header Card (Avatar, Tên, Title, Tag VIP) */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="h-16 w-16 rounded-full border-2 border-blue-500 p-0.5"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
              <p className="text-sm font-medium text-blue-600">{candidate.title}</p>
            </div>
          </div>
          {/* "Tag" (Tag) "VIP" (VIP) (Nếu "là" (is) "VIP" (VIP)) */}
          {candidate.isVip && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
              <Star size={12} fill="currentColor" />
              VIP
            </span>
          )}
        </div>

        {/* 2. Thông tin "phụ" (extra) (Địa điểm, Cấp bậc) */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <MapPin size={16} className="text-red-500" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <User size={16} className="text-gray-500" />
            <span>{candidate.level}</span>
          </div>
        </div>

        {/* 3. "Kỹ năng" (Skills) (Hiển thị "dưới" (as) "dạng" (form) "tag" (tags)) */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">KỸ NĂNG NỔI BẬT</h4>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 4. "Nút" (Buttons) "Hành động" (Action) (Xem Hồ sơ & Nhắn tin) */}
        <div className="mt-5 flex items-center space-x-3 border-t pt-4">
          <Link
            to={`/profile/${candidate.id}`} // "Giả lập" (Mockup) "link" (link) "đến" (to) "profile" (profile)
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300
                       px-4 py-2 text-sm font-semibold text-gray-800 
                       hover:bg-gray-100"
          >
            <User size={16} />
            <span>Xem Hồ sơ</span>
          </Link>
          <button
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 
                       px-4 py-2 text-sm font-semibold text-white 
                       shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <Mail size={16} />
            <span>Nhắn tin</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateCard;