import axios from 'axios';
import { io } from 'socket.io-client';

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

// Socket connection management
let socket = null;

export const socketAPI = {
  connect: () => {
    if (!socket) {
      socket = io('http://localhost:3000'); // Match your server URL
      console.log('Socket connected');
    }
    return socket;
  },
  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Socket disconnected');
    }
  },
  
  joinAsAdmin: () => {
    if (socket) {
      socket.emit('adminJoin');
      console.log('Joined as admin');
    } else {
      console.error('Socket not connected');
    }
  },
  
  startAuction: (duration) => {
    if (socket) {
      socket.emit('startAuction', duration);
      console.log(`Starting auction timer for ${duration} seconds`);
    } else {
      console.error('Socket not connected');
    }
  },
  
  placeBid: (data) => {
    if (socket) {
      socket.emit('placeBid', data);
      console.log(`Placing bid: ${data.bidAmount} by ${data.teamName}`);
    } else {
      console.error('Socket not connected');
    }
  },
  
  onCurrentBid: (callback) => {
    if (socket) {
      socket.on('currentBid', callback);
    }
  },
  
  onNewBid: (callback) => {
    if (socket) {
      socket.on('newBid', callback);
    }
  },
  
  onTimerUpdate: (callback) => {
    if (socket) {
      socket.on('timerUpdate', callback);
    }
  },
  
  onAuctionStarted: (callback) => {
    if (socket) {
      socket.on('auctionStarted', callback);
    }
  },
  
  onAuctionEnded: (callback) => {
    if (socket) {
      socket.on('auctionEnded', callback);
    }
  },
  
  onBidFailed: (callback) => {
    if (socket) {
      socket.on('bidFailed', callback);
    }
  },
  
  onAdminLogs: (callback) => {
    if (socket) {
      socket.on('adminLogs', callback);
    }
  }
};

// Admin API endpoints
export const adminAPI = {
  login: (credentials) => API.post('/admin/login', credentials),
  
  getTeamCount: () => API.get('/admin/teamCount'),
  
  changeEventStatus: (newStatus) => API.post('/admin/changeEventStatus', { newStatus }),
  
  sellPOC: () => API.post('/admin/sold'),
  
  updateCurrentAuctionPOC: (data) => API.post('/admin/biddingPOC', data),
  
  distributePOC: () => API.post('/admin/distributePOC'),
  
  toggleRegistration: () => API.post('/admin/toggle-registration'),
    
  getBidHistory: async () => {
    try {
      const response = await API.get('/admin/bidHistory');
      return response.data;
    } catch (error) {
      console.error('Error fetching bid history:', error);
      throw error;
    }
  },
  
  getTeamStats: async () => {
    try {
      const response = await API.get('/admin/teamStats');
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  }
};

export default API;