import axios from 'axios';
import { io } from 'socket.io-client';
const API = axios.create({
  baseURL: 'https://codopoly-kriya2025.onrender.com', // HTTP server URL
  timeout: 30000,
});

API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('codopoly_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


let socket = null;

export const socketAPI = {
  connect: () => {
    if (!socket) {
      socket = io('https://codopoly-kriya2025-1.onrender.com'); // Socket.IO server URL
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
  
  placeBid: (data) => socket?.emit('placeBid', data),

  onCurrentBid: (callback) => socket?.on('currentBid', callback),
  onNewBid: (callback) => socket?.on('newBid', callback),
  onTimerUpdate: (callback) => socket?.on('timerUpdate', callback),
  onAuctionStarted: (callback) => socket?.on('auctionStarted', callback),
  onAuctionEnded: (callback) => socket?.on('auctionEnded', callback),
  onAuctionStatus: (callback) => socket?.on('auctionStatus', callback),
  onSellPOCSuccess: (callback) => socket?.on('sellPOCSuccess', callback),
  onSellPOCFailed: (callback) => socket?.on('sellPOCFailed', callback),
  onBidFailed: (callback) => socket?.on('bidFailed', callback),
  onAdminLogs: (callback) => socket?.on('adminLogs', callback),
  leaderBoard: (callback) => socket?.on('leaderboard',callback),
  onUpdatePOCSuccess: (callback) => socket?.on('updatePOCSuccess', callback),

  offCurrentBid: () => socket?.off('currentBid'),
  offNewBid: () => socket?.off('newBid'),
  offUpdatePOCSuccess: () => socket?.off('updatePOCSuccess'),
  offBidFailed: () => socket?.off('bidFailed'),
  offAuctionStatus: () => socket?.off('auctionStatus'),
  offTimerUpdate: () => socket?.off('timerUpdate'),
  offAuctionStarted: () => socket?.off('auctionStarted'),
  offSellPOCSuccess: () => socket?.off('sellPOCSuccess'),
  offAuctionEnded: () => socket?.off('auctionEnded'),
};

export const serverAPI = {
    login : (formData)=>API.post('/team/login',formData),
    register : (formData)=>API.post('/team/register',formData),
    getPOC : (data)=>API.get(`/question/getPOC/${data}`),
    fetchTeam : ()=>API.get('/team/details'),
    getDebugPOC : ()=>API.get('/debug/poc'),
    getDebugPOCduringAuction : ()=>('/question/POC'),
    submitDebug : (data)=>API.post('/debug/submit',data),
    getDebugs: (questionTitle, pocName) => 
      API.get('/debug/getdebugs', {
          params: { questionTitle, pocName }
      })
}
export default API;