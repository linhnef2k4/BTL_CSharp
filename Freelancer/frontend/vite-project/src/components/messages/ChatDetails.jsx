import React from 'react';
import { ChevronDown, File, Image } from 'lucide-react';

// Component con cho thanh "cuộn"
const AccordionSection = ({ title, icon, children }) => (
  <details className="group border-b border-gray-200" open>
    <summary className="flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronDown size={20} className="text-gray-500 group-open:rotate-180 transition-transform" />
    </summary>
    <div className="p-3">
      {children}
    </div>
  </details>
);

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${name?.replace(' ', '+')}&background=random&color=fff`;

const ChatDetails = ({ activeChat }) => {
  if (!activeChat) return null;

  return (
    <div className="flex h-full flex-col">
      {/* 1. Header (Info người dùng thật) */}
      <header className="flex flex-shrink-0 flex-col items-center p-4 border-b border-gray-200">
        <img 
            src={getAvatarUrl(activeChat.otherParticipantFullName)} 
            alt={activeChat.otherParticipantFullName} 
            className="h-20 w-20 rounded-full" 
        />
        <h3 className="mt-2 text-lg font-semibold text-center">{activeChat.otherParticipantFullName}</h3>
        <p className="text-sm text-gray-500 text-center">{activeChat.otherParticipantHeadline}</p>
      </header>
      
      {/* 2. Các thanh cuộn (Accordion) */}
      <div className="flex-1 overflow-y-auto">
        
        {/* File phương tiện (Placeholder vì chưa có API) */}
        <AccordionSection title="File & phương tiện" icon={<Image size={20} />}>
          <div className="text-center text-gray-400 text-xs italic py-4">
             Chưa có hình ảnh (Tính năng đang phát triển)
          </div>
          {/* <div className="grid grid-cols-3 gap-1">
             Mock images here if needed 
          </div>
          */}
        </AccordionSection>

        {/* File (Placeholder vì chưa có API) */}
        <AccordionSection title="File" icon={<File size={20} />}>
          <div className="text-center text-gray-400 text-xs italic py-4">
             Chưa có tệp tin (Tính năng đang phát triển)
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default ChatDetails;