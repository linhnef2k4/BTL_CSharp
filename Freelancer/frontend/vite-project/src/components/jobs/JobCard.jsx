import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, CheckCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatSalary, formatTimeAgo } from '../../utils/formatUtils'; // Import helper

// Hàm lấy logo fallback nếu không có ảnh
const getCompanyLogo = (name, logoUrl) => {
  if (logoUrl) return logoUrl;
  const initial = name ? name.charAt(0).toUpperCase() : 'C';
  return `https://placehold.co/56x56/00529c/ffffff?text=${initial}`;
};

const JobCard = ({ job, isApplied, onApply }) => { 
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation(); 
    if (!isApplied) {
      onApply(job.id, job.title); 
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="cursor-pointer rounded-xl border border-gray-100 bg-white shadow-sm transition-all 
                 duration-300 hover:shadow-lg hover:-translate-y-1 group"
      whileHover={{ y: -4 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={getCompanyLogo(job.companyName, job.logoCompany)}
              alt={`${job.companyName} logo`}
              className="h-14 w-14 rounded-lg border object-contain bg-white"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-gray-500">{job.companyName}</p>
            </div>
          </div>
          {/* Giả sử API có trường isHot hoặc logic VIP nào đó */}
          {/* Tạm thời ẩn hoặc check logic VIP từ employer */}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <DollarSign size={16} className="text-green-600" />
            <span className="font-medium text-green-700">
                {formatSalary(job.minSalary, job.maxSalary)}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <MapPin size={16} className="text-blue-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <Clock size={16} className="text-orange-500" />
            <span>{job.workType}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium">
             {formatTimeAgo(job.createdDate)}
          </p>
          <button
            onClick={handleApplyClick}
            disabled={isApplied} 
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm
                        transition-all duration-200 
                        ${isApplied 
                          ? 'cursor-not-allowed bg-green-100 text-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        }`}
          >
            {isApplied ? <Check size={16} /> : <CheckCircle size={16} />}
            <span>{isApplied ? 'Đã nộp đơn' : 'Ứng tuyển ngay'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;