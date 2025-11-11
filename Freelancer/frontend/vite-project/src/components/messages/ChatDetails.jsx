import React from 'react';
import { ChevronDown, ChevronUp, File, Image } from 'lucide-react';

// Component con cho thanh "cuộn" (giống Facebook)
const AccordionSection = ({ title, icon, children }) => (
  <details className="group border-b border-gray-200" open>
    <summary className="flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      {/* Icon xoay (y hệt Facebook) */}
      <ChevronDown size={20} className="text-gray-500 group-open:rotate-180 transition-transform" />
    </summary>
    <div className="p-3">
      {children}
    </div>
  </details>
);

// Dữ liệu "giả"
const MOCK_MEDIA = [
  { id: 1, type: 'img', src: 'https://placehold.co/100x100/3498db/ffffff?text=IMG1' },
  { id: 2, type: 'img', src: 'https://placehold.co/100x100/2ecc71/ffffff?text=IMG2' },
  { id: 3, type: 'img', src: 'https://placehold.co/100x100/e74c3c/ffffff?text=IMG3' },
];

const MOCK_FILES = [
  { id: 1, name: 'BaoGia_DuAn.pdf', size: '1.2 MB' },
  { id: 2, name: 'Requirements.docx', size: '256 KB' },
];

// Component chính
const ChatDetails = ({ activeUser }) => {
  return (
    <div className="flex h-full flex-col">
      {/* 1. Header (Info người dùng) */}
      <header className="flex flex-shrink-0 flex-col items-center p-4 border-b border-gray-200">
        <img src={activeUser.avatar} alt={activeUser.name} className="h-20 w-20 rounded-full" />
        <h3 className="mt-2 text-lg font-semibold">{activeUser.name}</h3>
        <p className="text-sm text-gray-500">{activeUser.status}</p>
      </header>
      
      {/* 2. Các thanh cuộn (Accordion) - "Gọn" */}
      <div className="flex-1 overflow-y-auto">
        
        {/* File phương tiện (như ảnh) */}
        <AccordionSection title="File & phương tiện" icon={<Image size={20} />}>
          <div className="grid grid-cols-3 gap-1">
            {MOCK_MEDIA.map(media => (
              <img 
                key={media.id} 
                src={media.src} 
                alt="Media file" 
                className="h-24 w-full rounded-md object-cover cursor-pointer" 
              />
            ))}
            <button className="flex h-24 w-full items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500 hover:bg-gray-200">
              Xem tất cả
            </button>
          </div>
        </AccordionSection>

        {/* File (như ảnh) */}
        <AccordionSection title="File" icon={<File size={20} />}>
          <div className="space-y-2">
            {MOCK_FILES.map(file => (
              <a 
                key={file.id} 
                href="#"
                className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100"
              >
                <File size={24} className="flex-shrink-0 text-blue-500" />
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </a>
            ))}
          </div>
        </AccordionSection>

        {/* Các mục khác đã được "bỏ đi" theo yêu cầu của bạn */}

      </div>
    </div>
  );
};

export default ChatDetails;