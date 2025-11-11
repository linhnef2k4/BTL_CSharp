import React from 'react';
import { useSortable } from '@dnd-kit/sortable'; // <-- "Động cơ" (Engine) "MỚI" (NEW) "1" (1)
import { CSS } from '@dnd-kit/utilities';        // <-- "Động cơ" (Engine) "MỚI" (NEW) "2" (2)
import { Mail, Phone, MoreVertical } from 'lucide-react';

/**
 * Đây là 1 "Card" (thẻ) "Ứng viên" (Applicant) (Dùng @dnd-kit)
 * @param {object} props
 * @param {object} props.applicant - Dữ liệu ứng viên (từ "data giả")
 */
const ApplicantCard = ({ applicant }) => {
  // "LOGIC" (LOGIC) "MỚI" (NEW) "CỦA" (OF) "@dnd-kit"
  const {
    attributes,   // "Props" (Props) "để" (to) "gắn" (attach) "vào" (to) "thẻ" (card)
    listeners,    // "Props" (Props) "để" (to) "lắng nghe" (listen) "kéo" (drag)
    setNodeRef,   // "Ref" (Ref) "cho" (for) "cái" (the) "thẻ" (card)
    transform,    // "Style" (Style) "về" (for) "vị trí" (position)
    transition,   // "Style" (Style) "về" (for) "chuyển động" (transition)
    isDragging    // "Biến" (State) "báo" (flag) "có" (is) "đang" (currently) "kéo" (dragging) "không" (not)
  } = useSortable({ id: applicant.id }); // "ID" (ID) "bắt buộc" (mandatory) "phải" (must) "là" (be) "ID" (ID) "của" (of) "item" (item)

  // "Style" (Style) "để" (to) "di chuyển" (move) "cái" (the) "card" (card) "khi" (when) "kéo" (dragging)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto', // "Nổi" (Pop) "lên" (up) "khi" (when) "kéo" (dragging)
    opacity: isDragging ? 0.9 : 1,     // "Hơi" (Slightly) "mờ" (transparent) "khi" (when) "kéo" (dragging)
  };

  return (
    <div
      ref={setNodeRef}   // <-- "Gắn" (Attach) "Ref" (Ref)
      style={style}        // <-- "Gắn" (Attach) "Style" (Style) "kéo-thả" (drag-and-drop)
      {...attributes}    // <-- "Gắn" (Attach) "Props" (Props) "kéo" (drag)
      {...listeners}     // <-- "Gắn" (Attach) "Props" (Props) "thả" (drop) (cho "toàn" (entire) "bộ" (whole) "cái" (the) "card" (card))
      
      className={`mb-3 rounded-lg bg-white p-3 shadow-md transition-shadow
                  hover:shadow-lg
                  ${isDragging ? 'shadow-2xl scale-105' : ''}`} // Style "khi" (when) "đang" (is) "kéo" (dragging)
    >
      {/* "PHẦN" (PART) "GIAO DIỆN" (UI) "BÊN DƯỚI" (BELOW) "NÀY" (THIS)
        "KHÔNG" (IS NOT) "THAY ĐỔI" (CHANGED) "GÌ" (AT ALL) "SO VỚI" (COMPARED TO) "FILE" (FILE) "LỖI" (BUGGY) "TRƯỚC" (BEFORE)
      */}
      
      {/* 1. Header Card (Avatar + Tên + Nút "...") */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img 
            src={applicant.avatar} 
            alt={applicant.name} 
            className="h-9 w-9 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{applicant.name}</p>
            <p className="text-xs text-gray-500">Apply: {applicant.time}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
      
      {/* 2. Job Ứng tuyển */}
      <p className="text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 inline-block mb-2">
        Ứng tuyển: {applicant.job}
      </p>
      
      {/* 3. Nút "Liên hệ" */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-green-100 px-2 py-1.5 text-xs font-semibold text-green-700
                     hover:bg-green-200"
        >
          <Phone size={14} />
          <span>Gọi</span>
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-blue-100 px-2 py-1.5 text-xs font-semibold text-blue-700
                     hover:bg-blue-200"
        >
          <Mail size={14} />
          <span>Nhắn tin</span>
        </button>
      </div>

    </div>
  );
};

export default ApplicantCard;