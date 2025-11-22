// src/services/api.js
import axios from 'axios';

// <<< SỬA DÒNG NÀY >>>
// Đổi từ localhost:5000 sang https://localhost:7051 (theo launchSettings.json)
const API_URL = 'https://localhost:7051/api'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;