// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
// Import ảnh nền bạn vừa lưu
import BgImage from '../assets/images/login-bg.jpg'; 

const AuthLayout = () => {
  return (
    // Container chính: toàn màn hình, flex, căn giữa
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Lớp phủ màu đen mờ: Giúp chữ/form nổi bật hơn */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Container nội dung: nằm đè lên lớp phủ (z-10) */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Đây là nơi Login.jsx hoặc Register.jsx sẽ được render */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default AuthLayout;