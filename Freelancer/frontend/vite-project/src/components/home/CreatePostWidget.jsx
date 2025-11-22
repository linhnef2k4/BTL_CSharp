import React from 'react';
import { Image, Smile } from 'lucide-react';

const getAvatarUrl = (user) => {
  if (user?.seeker?.avatarUrl) return user.seeker.avatarUrl;
  const name = user?.fullName?.replace(/\s/g, '+') || 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

const CreatePostWidget = ({ user, onClick }) => {
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'bạn';

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={getAvatarUrl(user)}
          alt="Avatar"
          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
        />
        <button
          onClick={onClick}
          className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-left text-gray-500 hover:bg-gray-200 transition duration-200 text-sm font-medium"
        >
          {firstName} ơi, bạn đang nghĩ gì thế?
        </button>
      </div>
      <div className="flex border-t border-gray-100 pt-3">
        <button 
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 transition"
        >
            <Image size={20} className="text-green-500" />
            <span className="text-sm font-medium">Ảnh/Video</span>
        </button>
        <button 
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 transition"
        >
            <Smile size={20} className="text-yellow-500" />
            <span className="text-sm font-medium">Cảm xúc</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePostWidget;