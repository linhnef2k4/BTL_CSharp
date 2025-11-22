// Cấu hình URL của Backend (Khớp với launchSettings.json)
export const API_BASE_URL = 'https://localhost:7051';

/**
 * Hàm lấy đường dẫn ảnh đầy đủ
 * @param {string} path - Đường dẫn ảnh từ API (vd: /uploads/avatars/...)
 * @param {string} name - Tên người dùng (để tạo ảnh placeholder nếu không có ảnh)
 * @returns {string} URL đầy đủ để hiển thị
 */
export const getAvatarUrl = (path, name = 'User') => {
  // 1. Nếu không có path -> Trả về ảnh mặc định theo tên
  if (!path) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
  }

  // 2. Nếu path đã là link tuyệt đối (http...) -> Trả về nguyên vẹn (vd: Google Avatar)
  if (path.startsWith('http')) {
    return path;
  }

  // 3. Nếu là đường dẫn tương đối -> Nối với Domain Backend
  // Đảm bảo có dấu / ở đầu
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};