import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ApplicantCard from './ApplicantCard';

const KanbanColumn = ({ id, title, count, applicants, color, onCardClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-72 min-w-[280px] max-h-full">
      {/* Header Cột */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${color} text-white shadow-sm`}>
        <h3 className="font-bold text-sm tracking-wide uppercase">{title}</h3>
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{count}</span>
      </div>

      {/* Vùng thả (Droppable Area) */}
      <div 
        ref={setNodeRef} 
        className="flex-1 bg-gray-100/50 border-x border-b border-gray-200 rounded-b-xl p-2 overflow-y-auto custom-scrollbar min-h-[150px]"
      >
        <SortableContext 
            id={id} 
            items={applicants.map(app => app.id.toString())} 
            strategy={verticalListSortingStrategy}
        >
          {applicants.map((app) => (
            <ApplicantCard 
                key={app.id} 
                applicant={app} 
                onClick={() => onCardClick(app)} 
            />
          ))}
        </SortableContext>
        
        {applicants.length === 0 && (
            <div className="h-24 flex items-center justify-center text-gray-400 text-xs italic border-2 border-dashed border-gray-200 rounded-lg m-1">
                Kéo thả vào đây
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;