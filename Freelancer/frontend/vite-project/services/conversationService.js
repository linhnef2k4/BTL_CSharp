import api from './api';

const BASE_URL = '/conversations';

const conversationService = {
  // 1. Bắt đầu cuộc trò chuyện (Tạo mới hoặc lấy cũ)
  // Trả về: { conversationId: 123 }
  startConversation: (recipientUserId) => api.post(`${BASE_URL}/${recipientUserId}`),

  // 2. Lấy danh sách chat (Hộp thư)
  getMyConversations: () => api.get(BASE_URL),

  // 3. Lấy tin nhắn của 1 hội thoại
  getMessages: (conversationId) => api.get(`${BASE_URL}/${conversationId}/messages`),

  // 4. Lấy file media (ảnh/file)
  getMedia: (conversationId, type) => api.get(`${BASE_URL}/${conversationId}/media`, { params: { type } }),
};

export default conversationService;