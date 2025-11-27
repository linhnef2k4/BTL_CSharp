import api from './api';

const BASE_URL = '/notifications';

const notificationService = {
  // Lấy danh sách thông báo của tôi
  getMyNotifications: () => api.get(BASE_URL),
  
  // (Mở rộng) Đánh dấu đã đọc (nếu backend hỗ trợ sau này)
  // markAsRead: (id) => api.post(`${BASE_URL}/${id}/read`),
};

export default notificationService;