import axios from 'axios';
import { io } from 'socket.io-client';
import SubmitQuestion from '../components/questions/SubmitQuestion';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'https://codopoly-kriya2025.onrender.com', // HTTP server URL
  timeout: 30000,
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
      socket = io('https://codopoly-kriya2025-1.onrender.com'); // Socket.IO server URL  https://codopoly-kriya2025-1.onrender.com
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
  
  joinAsAdmin: () => socket?.emit('adminJoin'),
  startAuction: (duration) => socket?.emit('startAuction', duration),
  placeBid: (data) => socket?.emit('placeBid', data),
  updatePOC: (data) => socket?.emit('updatePOC', data),
  sellPOC: () => socket?.emit('sellPOC'),

  onCurrentBid: (callback) => socket?.on('currentBid', callback),
  onNewBid: (callback) => socket?.on('newBid', callback),
  onTimerUpdate: (callback) => socket?.on('timerUpdate', callback),
  onAuctionStarted: (callback) => socket?.on('auctionStarted', callback),
  onAuctionEnded: (callback) => socket?.on('auctionEnded', callback),
  onSellPOCSuccess: (callback) => socket?.on('sellPOCSuccess', callback),
  onSellPOCFailed: (callback) => socket?.on('sellPOCFailed', callback),
  onBidFailed: (callback) => socket?.on('bidFailed', callback),
  onAdminLogs: (callback) => socket?.on('adminLogs', callback),
  leaderBoard: (callback) => socket?.on('leaderboard',callback)
};

// Admin API endpoints
export const adminAPI = {
  login: (credentials) => API.post('/admin/login', credentials),
  getTeamCount: () => API.get('/admin/teamCount'),
  getEventStatus: () => API.get('/admin/eventStatus'),
  changeEventStatus: (newStatus) => API.post('/admin/changeEventStatus', { newStatus }),
  sellPOC: () => API.post('/admin/sold'),
  updateCurrentAuctionPOC: (data) => API.post('/admin/biddingPOC', data),
  distributePOC: () => API.post('/admin/distributePOC'),
  toggleRegistration: () => API.post('/admin/toggle-registration'),
  saveDistributedPOC: ()=>API.post('/admin/saveDistributedPOC'),
  getTeamWithPoints : ()=>API.get('/admin/getTeamWithPoints'),
  addTeamPoints : (teamsToUpdate)=>API.post('/admin/addTeamPoints',teamsToUpdate),
  fetchQnData : ()=>API.get('/admin/fetchQnData'),
  makeBuyPOCtrue : ()=>API.get('/admin/makeBuyPOCtrue'),
  SubmitQuestion : (data)=>API.post('/question/submit',data),
  viewQuestion : ()=>API.get('/question'),
  getTeamsWithPOC : ()=>API.get('admin/getTeamsWithPOCs'),
  getBidHistory: async () => {
    try {
      const response = await API.get('/admin/bidHistory');
      return response.data;
    } catch (error) {
      console.error('Error fetching bid history:', error);
      throw error;
    }
  },
  deletePOCs : async (data) => {
    try {
      const response = await API.post('/admin/deletePOCs', data);
      return response.data;
    } catch (error) {
      console.error('Error deleting POCs:', error);
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
  },

  getPOCsToBeSold: async () => {
    try {
      const response = await API.get('/admin/POCsToBeSold');
      return response.data || { POCsToBeSold: [] };
    } catch (error) {
      console.error("Error fetching POCs to be sold:", error);
      return { POCsToBeSold: [] };
    }
  },

  markPOCSold: async (POC_name) => {
    return await API.post('/admin/markPOCSold', { POC_name });
  }
};

export default API;