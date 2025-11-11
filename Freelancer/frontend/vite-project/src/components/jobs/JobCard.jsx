import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, CheckCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job, isApplied, onApply }) => { // <-- NHẬN PROPS MỚI
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  // Nâng cấp hàm click Ứng tuyển
  const handleApplyClick = (e) => {
    e.stopPropagation(); // Ngăn click lan ra ngoài
    if (!isApplied) {
      onApply(job.id, job.title); // Gọi hàm của cha (truyền ID và Title)
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="cursor-pointer rounded-xl border bg-white shadow-md transition-all 
                 duration-300 hover:shadow-xl hover:-translate-y-1"
      whileHover={{ y: -5 }}
    >
      <div className="p-5">
        {/* ... (Phần thông tin chính giữ nguyên) ... */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="h-14 w-14 rounded-lg border object-contain"
            />
            <div>
              <h3 className="text-lg font-bold text-blue-600 hover:underline">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-gray-700">{job.companyName}</p>
            </div>
          </div>
          {job.isHot && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              Hot
            </span>
          )}
        </div>

        {/* ... (Thông tin phụ giữ nguyên) ... */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <DollarSign size={16} className="text-green-500" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <MapPin size={16} className="text-red-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <Clock size={16} className="text-blue-500" />
            <span>{job.type}</span>
          </div>
        </div>

        {/* Nút "Ứng tuyển" (ĐÃ NÂNG CẤP) */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-gray-400">Đăng {job.postedTime}</p>
          <button
            onClick={handleApplyClick}
            disabled={isApplied} // <-- Vô hiệu hóa nếu đã ứng tuyển
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-semibold text-white shadow-lg
                       transition-all duration-200 
                       ${isApplied 
                         ? 'cursor-not-allowed bg-gray-400' // <-- STYLE MỚI
                         : 'bg-blue-600 hover:scale-105'
                       }`}
          >
            {isApplied ? <Check size={18} /> : <CheckCircle size={18} />}
            <span>{isApplied ? 'Đã ứng tuyển' : 'Ứng tuyển'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;