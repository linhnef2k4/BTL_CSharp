import api from './api';

const BASE_URL = '/profile';

const profileService = {
  // Lấy profile của chính mình
  getMyProfile: () => api.get(`${BASE_URL}/me`),
  
  // Cập nhật profile
  updateMyProfile: (data) => api.put(`${BASE_URL}/me`, data),
  
  // Lấy profile của người khác theo ID
  getUserProfile: (userId) => api.get(`${BASE_URL}/${userId}`),
  
  // Yêu cầu lên Employer
  requestEmployer: (data) => api.post(`${BASE_URL}/request-employer`, data),
};

export default profileService;