// src/services/api.js
import axios from 'axios';

// URL của backend ASP.NET Core API
// Khi deploy, bạn sẽ đổi thành domain thật
const API_URL = 'http://localhost:5000/api'; // Hoặc cổng 7xxx nếu dùng HTTPS

const api = axios.create({
  baseURL: API_URL,
});

// (Nâng cao) Cấu hình interceptor để đính kèm token (JWT) vào mỗi request
// khi người dùng đã đăng nhập
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Lấy token từ local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;