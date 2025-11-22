import api from './api';

const BASE_URL = '/social-posts';

const socialService = {
  // --- FEED & POSTS ---
  getFeed: () => api.get(`${BASE_URL}/feed`),
  createPost: (data) => api.post(BASE_URL, data), // { content, imageUrl }
  updatePost: (postId, data) => api.put(`${BASE_URL}/${postId}`, data),
  deletePost: (postId) => api.delete(`${BASE_URL}/${postId}`), // Soft delete

  // --- MY POSTS & TRASH ---
  getMyPosts: () => api.get(`${BASE_URL}/my-posts`),
  getTrash: () => api.get(`${BASE_URL}/trash`),
  restorePost: (postId) => api.post(`${BASE_URL}/trash/${postId}/restore`),
  deletePermanent: (postId) => api.delete(`${BASE_URL}/trash/${postId}/permanent`),

  // --- INTERACTION (LIKE/SAVE) ---
  reactToPost: (postId, type) => api.post(`${BASE_URL}/${postId}/react`, { reactionType: type }),
  savePost: (postId) => api.post(`${BASE_URL}/${postId}/save`),
  unsavePost: (postId) => api.delete(`${BASE_URL}/${postId}/unsave`),
  getSavedPosts: () => api.get(`${BASE_URL}/saved`),

  // --- COMMENTS ---
  getComments: (postId) => api.get(`${BASE_URL}/${postId}/comments`),
  postComment: (postId, data) => api.post(`${BASE_URL}/${postId}/comments`, data), // { content, parentCommentId }
  reactToComment: (commentId, type) => api.post(`${BASE_URL}/comments/${commentId}/react`, { reactionType: type }),
};

export default socialService;