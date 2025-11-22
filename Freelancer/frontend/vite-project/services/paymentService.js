import api from './api';

const BASE_URL = '/payment';

const paymentService = {
  // 1. Tạo link thanh toán cho Employer
  createVipOrderEmployer: () => api.post(`${BASE_URL}/create-vip-order`),

  // 2. Tạo link thanh toán cho Seeker
  createVipOrderSeeker: () => api.post(`${BASE_URL}/create-vip-order/seeker`),
};

export default paymentService;