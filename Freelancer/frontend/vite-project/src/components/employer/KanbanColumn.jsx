import React from 'react';
// --- "FIX" (FIX) "LÀ" (IS) "Ở" (AT) "ĐÂY" (HERE) ---
import { useDroppable } from '@dnd-kit/core'; // "Thằng" (Guy) "Core" (Core) "chỉ" (only) "giữ" (keeps) `useDroppable`
import { 
  SortableContext, // "Thằng" (Guy) `SortableContext` "nó" (it) "PHẢI" (MUST) "ở" (be) "đây" (here)
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'; 
// --- "HẾT" (END) "FIX" (FIX) ---
import ApplicantCard from './ApplicantCard'; // "Import" (Import) "cái" (the) "card" (card) (File 1/4)

/**
 * Đây là 1 "Cột" (Column) "Kanban" (Kanban) (Dùng @dnd-kit)
 * @param {object} props
 * @param {object} props.column - Dữ liệu "của" (of) "cột" (column)
 * @param {Array} props.applicants - "Danh sách" (List) "các" (the) "ứng viên" (applicants)
 */
const KanbanColumn = ({ column, applicants }) => {
  // 1. "Làm" (Make) "cho" (for) "cái" (the) "cột" (column) "này" (this) "trở thành" (become) "1" (one) "VÙNG" (AREA) "THẢ" (DROPPABLE)
  const { setNodeRef, isOver } = useDroppable({
    id: column.id, 
  });

  // 2. "Lấy" (Get) "ra" (out) "danh sách" (list) "các" (the) "ID" (IDs) "của" (of) "ứng viên" (applicants)
  const applicantIds = applicants.map(app => app.id);

  return (
    // "Khung" (Frame) "của" (of) "cái" (the) "cột" (column)
    <div className="flex flex-col w-72 rounded-lg bg-gray-100 shadow-inner">
      
      {/* Header "của" (of) "Cột" (Column) (Giữ "nguyên" (same)) */}
      <div className={`flex items-center justify-between p-3 rounded-t-lg ${column.color} bg-opacity-90`}>
        <h3 className="font-semibold text-sm text-white">{column.title}</h3>
        <span className="text-xs text-white bg-black bg-opacity-20 rounded-full px-2 py-0.5">
          {applicants.length}
        </span>
      </div>

      {/* "BỌC" (WRAP) "BẰNG" (IN) "SortableContext" (Giữ "nguyên" (same)) */}
      <SortableContext items={applicantIds} strategy={verticalListSortingStrategy}>
        
        {/* "Vùng" (Area) "Nội dung" (Content) (Gắn "Ref" (Ref)) */}
        <div
          ref={setNodeRef} // <-- "Ref" (Ref) "của" (of) "VÙNG" (AREA) "THẢ" (DROP)
          
          className={`flex-1 p-3 min-h-[400px] transition-colors
                      ${isOver ? 'bg-blue-50' : 'bg-gray-100'}`}
        >
          {/* "Vẽ" (Render) "các" (the) "card" (cards) (File 1/4) "ra" (out) */}
          {applicants.map((applicant) => (
            <ApplicantCard 
              key={applicant.id} 
              applicant={applicant} 
            />
          ))}
          
        </div>

      </SortableContext>
    </div>
  );
};

export default KanbanColumn;