import React from 'react';
import { X, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatBox = ({ user, onClose }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-4 right-6 z-50 w-80 rounded-2xl border border-gray-200 bg-white shadow-2xl backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img
              src={user.avatar}
              alt="Avatar"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-green-400"></span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-[11px] text-blue-100">Đang hoạt động</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1 transition hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nội dung tin nhắn */}
      <div className="h-72 space-y-2 overflow-y-auto bg-gray-50 p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex justify-start">
          <span className="max-w-[75%] rounded-2xl bg-gray-200 px-3 py-1.5 text-sm shadow-sm">
            Chào bạn!
          </span>
        </div>
        <div className="flex justify-end">
          <span className="max-w-[75%] rounded-2xl bg-blue-500 px-3 py-1.5 text-sm text-white shadow-sm">
            Chào {user.name}!
          </span>
        </div>
      </div>

      {/* Input chat */}
      <div className="flex items-center border-t bg-white/80 p-2 backdrop-blur">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
        <button className="ml-2 rounded-full p-2 text-blue-600 transition hover:bg-blue-50">
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatBox;
