import api from './api';

const BASE_URL = '/admin';

const adminService = {
  // --- USER MANAGEMENT ---
  getAllUsers: (params) => api.get(`${BASE_URL}/users`, { params }),
  getUserDetail: (id) => api.get(`${BASE_URL}/users/${id}`),
  toggleUserLock: (id) => api.post(`${BASE_URL}/users/${id}/toggle-lock`),
  resetUserPassword: (id) => api.post(`${BASE_URL}/users/${id}/reset-password`),

  // --- EMPLOYER MODERATION ---
  getPendingEmployers: (searchTerm) => api.get(`${BASE_URL}/employer-requests/pending`, { params: { searchTerm: searchTerm || null } }),
  approveEmployer: (id) => api.post(`${BASE_URL}/employer-requests/${id}/approve`),
  rejectEmployer: (id) => api.post(`${BASE_URL}/employer-requests/${id}/reject`),

  // --- JOB MODERATION (MỚI) ---
  
  // 1. Lấy danh sách Job chờ duyệt (Gọi sang ProjectsController như backend đã định nghĩa)
  getPendingProjects: () => api.get('/projects/pending'),

  // 2. Duyệt Job (Gọi AdminController)
  approveProject: (id) => api.post(`${BASE_URL}/projects/${id}/approve`),

  // 3. Từ chối Job (Gọi AdminController)
  rejectProject: (id) => api.post(`${BASE_URL}/projects/${id}/reject`),
  
  // 4. Lấy chi tiết 1 job (Dùng chung API public hoặc API admin)
  getProjectDetail: (id) => api.get(`/projects/${id}`),
};

export default adminService;