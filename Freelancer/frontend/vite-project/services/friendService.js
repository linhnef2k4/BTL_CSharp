import api from './api';

const BASE_URL = '/friends';

const friendService = {
  // 1. Gửi kết bạn
  sendRequest: (receiverId) => api.post(`${BASE_URL}/send-request/${receiverId}`),

  // 2. Lấy danh sách lời mời kết bạn (Pending)
  getPendingRequests: () => api.get(`${BASE_URL}/pending-requests`),

  // 3. Chấp nhận
  acceptRequest: (friendshipId) => api.post(`${BASE_URL}/accept-request/${friendshipId}`),

  // 4. Từ chối
  rejectRequest: (friendshipId) => api.post(`${BASE_URL}/reject-request/${friendshipId}`),

  // 5. Lấy danh sách bạn bè
  getFriends: () => api.get(BASE_URL),

  // 6. Tìm kiếm người dùng (Global search - dùng để tìm người mới)
  searchUsers: (query) => api.get(`${BASE_URL}/search`, { params: { query } }),
};

export default friendService;