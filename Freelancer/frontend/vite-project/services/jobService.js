import api from './api';

const BASE_URL = '/projects';

const jobService = {
  // 1. Lấy danh sách Job (có search & filter)
  getJobs: (params) => {
    // params: { searchTerm, location, minSalary, maxSalary, level, workType }
    return api.get(BASE_URL, { params });
  },

  // 2. Lấy chi tiết 1 Job
  getJobDetail: (id) => api.get(`${BASE_URL}/${id}`),

  // 3. Ứng tuyển (Seeker)
  applyToJob: (id, data) => api.post(`${BASE_URL}/${id}/apply`, data), // data: { coverLetter, cvUrl }

  // 4. Lấy danh sách VIP (Gọi sang ProfileController như bạn mô tả)
  getVipEmployers: () => api.get('/profile/employer/vip'),
  getVipSeekers: () => api.get('/profile/seeker/vip'),
};

export default jobService;