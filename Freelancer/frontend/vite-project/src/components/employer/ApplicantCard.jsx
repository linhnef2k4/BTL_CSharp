import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Mail } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';

// Hàm tạo avatar
const getAvatarUrl = (name, url) => {
  if (url) return url;
  const display = name ? name.replace(/\s/g, '+') : 'U';
  return `https://ui-avatars.com/api/?name=${display}&background=random&color=fff`;
};

const ApplicantCard = ({ applicant, onClick }) => {
  // Hook của dnd-kit để biến component thành vật thể kéo được
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: applicant.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all mb-3 group"
    >
      <div className="flex items-start gap-3">
        <img 
          src={getAvatarUrl(applicant.seekerFullName, applicant.seekerAvatar)} 
          alt="Avt" 
          className="w-10 h-10 rounded-full object-cover border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm truncate">{applicant.seekerFullName}</h4>
          <p className="text-xs text-gray-500 truncate">{applicant.seekerHeadline || 'Ứng viên'}</p>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
             <Mail size={12} /> <span className="truncate">{applicant.seekerEmail}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
             <Clock size={12} /> <span>{formatTimeAgo(applicant.appliedDate)}</span>
          </div>
      </div>
    </div>
  );
};

export default ApplicantCard;