// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from '../components/shared/NavBar'; // <-- 1. IMPORT NAV BAR

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Thêm màu nền cho body */}
      <NavBar /> {/* <-- 2. GẮN NAV BAR VÀO ĐÂY */}
      
      <main>
        {/* Đây là nơi các trang con (Home, Jobs...) được render */}
        <Outlet />
      </main>

      {/* Bạn có thể thêm Footer ở đây sau */}
    </div>
  );
};

export default MainLayout;