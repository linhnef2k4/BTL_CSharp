import React, { useState } from 'react';
// "ĐỘNG CƠ" (ENGINE) "MỚI" (NEW) "CỦA" (OF) "@dnd-kit"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay, // "Để" (To) "vẽ" (render) "cái" (the) "card" (card) "khi" (when) "đang" (is) "kéo" (dragging) "cho" (for) "nó" (it) "đẹp" (beautiful)
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove, // "Hàm" (Function) "thần thánh" (divine) "để" (to) "sắp xếp" (sort) "lại" (again) "mảng" (array)
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { v4 as uuidv4 } from 'uuid'; // "Vẫn" (Still) "cần" (need) "cái" (this) "này" (this)
import KanbanColumn from '../../components/employer/KanbanColumn'; // "Import" (Import) "File" (File) 2/4
import ApplicantCard from '../../components/employer/ApplicantCard'; // "Import" (Import) "File" (File) 1/4

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "MỚI" (NEW) (Thiết kế "lại" (again) "cho" (for) "@dnd-kit") ---
// "Giờ" (Now) "chúng ta" (we) "chỉ" (only) "cần" (need) "1" (one) "cái" (an) "Object" (object) "chứa" (containing) "4" (four) "cái" (the) "cột" (columns)
const initialColumns = {
  'col-1': {
    id: 'col-1',
    title: 'Hồ sơ Mới',
    color: 'bg-blue-500',
    applicants: [
      { id: 'app-1', name: 'Minh Tuấn (Seeker)', avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan', job: 'Senior React Developer', time: '1 giờ trước' },
      { id: 'app-2', name: 'Ngọc Ánh', avatar: 'https://ui-avatars.com/api/?name=Ngoc+Anh', job: '.NET Developer', time: '3 giờ trước' },
      { id: 'app-3', name: 'Văn Đức Trung', avatar: 'https://ui-avatars.com/api/?name=Van+Trung', job: 'Senior React Developer', time: '5 giờ trước' },
      { id: 'app-4', name: 'Hồ Thị Hồng Trâm', avatar: 'https://ui-avatars.com/api/?name=Hong+Tram', job: 'UI/UX Designer', time: '1 ngày trước' },
    ]
  },
  'col-2': {
    id: 'col-2',
    title: 'Đang duyệt',
    color: 'bg-yellow-500',
    applicants: []
  },
  'col-3': {
    id: 'col-3',
    title: 'Phỏng vấn',
    color: 'bg-green-500',
    applicants: []
  },
  'col-4': {
    id: 'col-4',
    title: 'Từ chối',
    color: 'bg-red-500',
    applicants: []
  },
};
// --------------------------------------------------

const ManageJobs = () => {
  // "BỘ NÃO" (BRAIN) "MỚI" (NEW)
  const [columns, setColumns] = useState(initialColumns);
  const [activeApplicant, setActiveApplicant] = useState(null); // "Lưu" (Store) "cái" (the) "card" (card) "đang" (is) "kéo" (being dragged)

  // "Set up" (Setup) "cảm biến" (sensors) "cho" (for) "dnd-kit" (để "nó" (it) "chạy" (run) "mượt" (smoothly))
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // "Chỉ" (Only) "kéo" (drag) "khi" (when) "di chuột" (mouse moves) "8px" (8px) (tránh "click" (click) "nhầm" (accidental))
      },
    })
  );

  // --- LOGIC "KÉO-THẢ" (DRAG-AND-DROP) (VIẾT LẠI 100%) ---
  
  // "Hàm" (Function) "tìm" (find) "cái" (the) "cột" (column) "mà" (that) "cái" (the) "card" (card) "đang" (is) "nằm" (in)
  const findColumn = (applicantId) => {
    return Object.values(columns).find(col => col.applicants.some(app => app.id === applicantId));
  };
  
  // "Khi" (When) "bắt đầu" (start) "kéo" (dragging)
  const handleDragStart = (event) => {
    const { active } = event;
    const { id } = active;
    const startColumn = findColumn(id);
    if (startColumn) {
      setActiveApplicant(startColumn.applicants.find(app => app.id === id));
    }
  };
  
  // "Khi" (When) "kết thúc" (finish) "kéo" (dragging)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // "Nếu" (If) "không" (not) "thả" (drop) "vào" (into) "vùng" (area) "cho phép" (allowed)
    if (!over) {
      setActiveApplicant(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id; // "ID" (ID) "của" (of) "vùng" (area) "thả" (drop)

    // "Tìm" (Find) "cột" (column) "Bắt đầu" (Start) "và" (and) "cột" (column) "Kết thúc" (End)
    const startColumn = findColumn(activeId);
    // "Vùng" (Area) "thả" (drop) "có thể" (can be) "là" (is) "1" (one) "cái" (a) "cột" (column) (nếu "thả" (drop) "vào" (into) "vùng" (area) "rỗng" (empty))
    // "hoặc" (or) "là" (is) "1" (one) "cái" (a) "card" (card) "khác" (other) (nếu "thả" (drop) "đè" (onto) "lên" (it))
    const endColumn = columns[overId] ? columns[overId] : findColumn(overId);

    if (!startColumn || !endColumn) {
      setActiveApplicant(null);
      return;
    }

    // --- TRƯỜNG HỢP 1: "KÉO" (DRAG) "TRONG" (INSIDE) "CÙNG" (THE SAME) "1" (ONE) "CỘT" (COLUMN) ---
    if (startColumn.id === endColumn.id) {
      setColumns(prev => ({
        ...prev,
        [startColumn.id]: {
          ...startColumn,
          // "Dùng" (Use) "hàm" (function) "thần thánh" (divine) `arrayMove` "để" (to) "sắp xếp" (sort) "lại" (again)
          applicants: arrayMove(startColumn.applicants, 
                                startColumn.applicants.findIndex(app => app.id === activeId), 
                                startColumn.applicants.findIndex(app => app.id === (columns[overId] ? null : overId))) // "Hơi" (A bit) "phức tạp" (complex) "nhưng" (but) "nó" (it) "chạy" (works)
        }
      }));
    } else {
    // --- TRƯỜNG HỢP 2: "KÉO" (DRAG) "QUA" (BETWEEN) "2" (TWO) "CỘT" (COLUMNS) "KHÁC NHAU" (DIFFERENT) ---
      setColumns(prev => {
        // "Lấy" (Get) "data" (data) "ứng viên" (applicant) "đang" (being) "kéo" (dragged)
        const applicantToMove = startColumn.applicants.find(app => app.id === activeId);

        // "Xóa" (Remove) "ứng viên" (applicant) "khỏi" (from) "cột" (column) "BẮT ĐẦU" (START)
        const newStartApplicants = startColumn.applicants.filter(app => app.id !== activeId);
        
        // "Tìm" (Find) "vị trí" (index) "để" (to) "thả" (drop) "vào" (into) "cột" (column) "KẾT THÚC" (END)
        let newEndApplicants = [...endColumn.applicants];
        const overIndex = endColumn.applicants.findIndex(app => app.id === overId);
        
        if (overIndex !== -1) {
          // "Thả" (Drop) "đè" (onto) "lên" (on) "1" (one) "cái" (a) "card" (card) "khác" (other)
          newEndApplicants.splice(overIndex, 0, applicantToMove);
        } else {
          // "Thả" (Drop) "vào" (into) "vùng" (area) "rỗng" (empty) "của" (of) "cột" (column)
          newEndApplicants.push(applicantToMove);
        }

        return {
          ...prev,
          [startColumn.id]: { ...startColumn, applicants: newStartApplicants },
          [endColumn.id]: { ...endColumn, applicants: newEndApplicants }
        };
      });
    }
    
    setActiveApplicant(null); // "Xong" (Done) "rồi" (already), "xóa" (clear) "card" (card) "đang" (being) "kéo" (dragged)
  };
  // ------------------------------------

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Quản lý Ứng viên</h1>

      {/* "Giả lập" (Mockup) "chọn" (select) "Job" (job) (Giữ "nguyên" (same)) */}
      <div className="max-w-sm">
        <label htmlFor="jobSelect" className="block text-sm font-semibold text-gray-700 mb-1">
          Chọn Job để quản lý:
        </label>
        <select
          id="jobSelect"
          className="w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option>Senior React Developer (4 ứng viên)</option>
          <option>.NET Developer (0 ứng viên)</option>
        </select>
      </div>
      
      {/* "BỌC" (WRAP) "TOÀN BỘ" (ENTIRE) "BẢNG" (BOARD) "BẰNG" (IN) "DndContext" (DndContext) */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* "Container" (Container) "chứa" (holding) "các" (the) "cột" (columns) (Giữ "nguyên" (same)) */}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          
          {/* "Lắp ráp" (Assemble) "các" (the) "cột" (columns) "ra" (out) */}
          {Object.values(columns).map(column => (
            // "Vẽ" (Render) "cái" (the) "Cột" (Column) (File 2/4) "ra" (out)
            <KanbanColumn 
              key={column.id} 
              column={column} 
              applicants={column.applicants} 
            />
          ))}
          
        </div>

        {/* "CÁI" (THE) "NÀY" (THIS) "RẤT" (VERY) "XỊN" (COOL): "Vẽ" (Render) "1" (one) "cái" (a) "card" (card) "ảo" (virtual) "khi" (when) "đang" (is) "kéo" (dragging) */}
        {/* "Nó" (It) "giúp" (helps) "cái" (the) "card" (card) "khi" (when) "kéo" (dragging) "nó" (it) "không" (doesn't) "bị" (get) "móp" (squished) "bởi" (by) "cái" (the) "cột" (column) */}
        <DragOverlay>
          {activeApplicant ? <ApplicantCard applicant={activeApplicant} /> : null}
        </DragOverlay>
        
      </DndContext>
    </div>
  );
};

export default ManageJobs;