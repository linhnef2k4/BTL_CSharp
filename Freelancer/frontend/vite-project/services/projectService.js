import api from './api';

const BASE_URL = '/projects';

const projectService = {
  // 1. Tạo Job
  createProject: (data) => api.post(BASE_URL, data),

  // 2. Lấy Job Chờ duyệt (Của tôi)
  getMyPendingProjects: () => api.get(`${BASE_URL}/my-pending-jobs`),

  // 3. Lấy Job Đang tuyển (Approved) - WORKAROUND
  // Vì backend chưa có API "GetMyApprovedJobs", ta gọi API search công khai rồi lọc theo ID
  getMyActiveProjects: async (employerId) => {
      // Gọi API search public (lấy hết hoặc phân trang lớn)
      const response = await api.get(BASE_URL); 
      // Lọc client-side
      const myJobs = response.data.filter(job => job.employerId === Number(employerId));
      return { data: myJobs };
  },

  // 4. Lấy danh sách ứng viên của 1 Job
  getJobApplications: (id) => api.get(`${BASE_URL}/${id}/applications`),

  // 5. Sửa Job
  updateProject: (id, data) => api.put(`${BASE_URL}/${id}`, data),

  // 6. Xóa mềm (Đưa vào thùng rác)
  deleteProject: (id) => api.delete(`${BASE_URL}/${id}`),

  // --- THÙNG RÁC ---
  getTrash: () => api.get(`${BASE_URL}/trash`),
  restoreProject: (id) => api.post(`${BASE_URL}/trash/${id}/restore`),
  deletePermanent: (id) => api.delete(`${BASE_URL}/trash/${id}/permanent`),
};

export default projectService;