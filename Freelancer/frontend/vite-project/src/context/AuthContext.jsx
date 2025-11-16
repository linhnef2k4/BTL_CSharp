import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo "Nhà cung cấp" (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Sẽ chứa UserProfileDto (JSON bạn gửi)
  const [isLoading, setIsLoading] = useState(true); // Trạng thái check token
  const navigate = useNavigate();

  /**
   * Hàm này lấy thông tin user DỰA TRÊN token trong localStorage.
   * Nó sẽ được gọi khi tải trang, hoặc khi gọi hàm login().
   */
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('authToken');
    
    // Nếu không có token, không cần làm gì cả
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      // Gửi token đã lưu lên server (đã cấu hình proxy)
      const response = await axios.get('/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Lưu toàn bộ DTO (bao gồm cả 'seeker' lồng bên trong)
      setUser(response.data); 
    } catch (error) {
      console.error('Lỗi fetch profile, có thể token hết hạn:', error);
      localStorage.removeItem('authToken'); // Xóa token hỏng/hết hạn
      setUser(null);
      // Chỉ đẩy về login nếu lỗi là 401 (Không có quyền)
      if (error.response && error.response.status === 401) {
        navigate('/login'); 
      }
    } finally {
      // Dù thành công hay thất bại, cũng dừng loading
      setIsLoading(false);
    }
  };

  // 3. Chạy 1 LẦN DUY NHẤT khi app khởi động
  // (mảng dependency rỗng `[]`)
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Hàm Login: Được gọi bởi trang Login.jsx
   * Nhận token, lưu vào localStorage, fetch profile, và chuyển trang.
   */
  const login = async (token) => {
    localStorage.setItem('authToken', token);
    setIsLoading(true); // Bắt đầu loading
    await fetchUserProfile(); // Lấy thông tin user ngay
    navigate('/'); // Chuyển về trang chủ
  };

  /**
   * Hàm Logout: Được gọi bởi NavBar.jsx
   * Xóa token, xóa state user, và chuyển về trang login.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Chuyển về trang login
  };

  // 6. Cung cấp các giá trị này cho toàn bộ app
  const value = {
    user, // Thông tin user (JSON bạn gửi)
    isAuthenticated: !!user, // boolean (true nếu user có data)
    isLoading, // Trạng thái check token
    login, // Hàm để đăng nhập
    logout, // Hàm để đăng xuất
    refetchUser: fetchUserProfile, // Hàm để Profile.jsx gọi sau khi update
  };

  // Bọc các "con" (children) bằng Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 7. Hook tùy chỉnh (Custom Hook)
 * Giúp các component khác dễ dàng lấy data
 * thay vì phải import useContext và AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};