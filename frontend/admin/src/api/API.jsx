import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your actual backend URL
  timeout: 10000,
});

// Add request interceptor to include auth token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin API endpoints
export const adminAPI = {
  login: (credentials) => API.post('/admin/login', credentials),
  getTeamCount: () => API.get('/admin/teamCount'),
  changeEventStatus: (newStatus) => API.post('/admin/changeEventStatus', { newStatus }),
  sellPOC: () => API.post('/admin/sold'),
  updateCurrentAuctionPOC: (data) => API.post('/admin/biddingPOC', data),
  distributePOC: () => API.post('/admin/distributePOC'),
  toggleRegistration: () => API.post('/admin/toggle-registration'),
};

export default API;