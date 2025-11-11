// src/pages/core/Home.jsx
import React, { useState } from 'react';
import LeftSidebar from '../../components/home/LeftSidebar';
import MainFeed from '../../components/home/MainFeed';
import RightSidebar from '../../components/home/RightSidebar';
import ChatBox from '../../components/home/ChatBox';

// Dữ liệu "giả" cho user. Sau này bạn sẽ lấy từ Context.
const mockUser = {
  name: 'Hồng Trâm',
  title: 'Frontend Developer',
  avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan&background=random',
  connections: 150,
  status: 'VIP',
  isPotential: true,
};

const Home = () => {
  // Logic để mở cửa sổ chat
  const [activeChat, setActiveChat] = useState(null); // 'null' hoặc { id, name, avatar }

  const handleOpenChat = (user) => {
    setActiveChat(user);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Đây là layout 3 cột "thần thánh" của Facebook/LinkedIn.
        Nó sẽ là 1 cột trên mobile, và 3 cột trên desktop (lg).
      */}
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 pt-6 lg:grid-cols-4">
        
        {/* CỘT 1: BÊN TRÁI (LinkedIn-style) */}
        <aside className="hidden lg:col-span-1 lg:block">
          <LeftSidebar user={mockUser} />
        </aside>

        {/* CỘT 2: Ở GIỮA (Facebook-style News Feed) */}
        <main className="col-span-1 lg:col-span-2">
          <MainFeed user={mockUser} />
        </main>

        {/* CỘT 3: BÊN PHẢI (Facebook-style Contacts) */}
        <aside className="hidden lg:col-span-1 lg:block">
          <RightSidebar onUserClick={handleOpenChat} />
        </aside>
      </div>

      {/* Cửa sổ chat pop-up */}
      {activeChat && (
        <ChatBox 
          user={activeChat} 
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
};

export default Home;