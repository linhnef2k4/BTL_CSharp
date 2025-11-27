import api from './api';

const BASE_URL = '/auth';

const authService = {
  // Đăng ký
  register: (data) => api.post(`${BASE_URL}/register`, data),

  // Đăng nhập
  login: (data) => api.post(`${BASE_URL}/login`, data),

  // <<< MỚI: Đổi mật khẩu >>>
  changePassword: (data) => api.post(`${BASE_URL}/change-password`, data),

  // Quên mật khẩu (Gửi email reset)
  forgotPassword: (email) => api.post(`${BASE_URL}/forgot-password`, { email }),
};

export default authService;