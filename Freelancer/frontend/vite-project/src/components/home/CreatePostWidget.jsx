import React from 'react';
import { Video, Image, FileText } from 'lucide-react';

const CreatePostWidget = ({ user, onClick }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md hover:shadow-lg transition-all">
      {/* Hàng trên: Avatar và ô nhập "giả" */}
      <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
        <img
          src={user.avatar}
          alt="Avatar"
          className="h-10 w-10 rounded-full border border-gray-300 shadow-sm"
        />

        {/* Nút mở modal */}
        <button
          onClick={onClick}
          className="w-full rounded-full bg-gray-100 px-4 py-2 text-left text-gray-600 hover:bg-gray-200 transition"
        >
          Chia sẻ kinh nghiệm của bạn, {user.name.split(' ')[0]}?
        </button>
      </div>

      {/* Hàng dưới: Các nút chức năng */}
      <div className="mt-3 flex justify-around">
        <button
          onClick={onClick}
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-500 hover:bg-gray-100 transition"
        >
          <Video className="h-5 w-5" />
          <span>Video</span>
        </button>

        <button
          onClick={onClick}
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold text-green-500 hover:bg-gray-100 transition"
        >
          <Image className="h-5 w-5" />
          <span>Ảnh</span>
        </button>

        <button
          onClick={onClick}
          className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-gray-100 transition"
        >
          <FileText className="h-5 w-5" />
          <span>Tài liệu</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostWidget;
