import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gavel, DollarSign, Users, Check, Timer, History, TrendingUp, Award } from 'lucide-react';
import { adminAPI } from '../api/API';
import { io } from 'socket.io-client';

const AuctionManagement = () => {
  const [currentPOC, setCurrentPOC] = useState('');
  const [round, setRound] = useState(1);
  const [maxAmount, setMaxAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  // Socket related states
  const [socket, setSocket] = useState(null);
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: null });
  const [timerDuration, setTimerDuration] = useState(30);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  
  // History and stats
  const [bidHistory, setBidHistory] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'stats'

  useEffect(() => {
    // Connect to the socket server
    const newSocket = io('http://localhost:3000'); // Adjust URL as needed
    setSocket(newSocket);

    // Listen for current bid updates
    newSocket.on('currentBid', (bid) => {
      console.log('Current bid received:', bid);
      setCurrentBid(bid);
    });

    // Listen for new bids
    newSocket.on('newBid', (bid) => {
      console.log('New bid received:', bid);
      setCurrentBid(bid);
      
      // Add to history if not already there
      setBidHistory(prev => {
        const exists = prev.some(item => item.id === bid.id);
        if (!exists && bid.id) {
          return [bid, ...prev].slice(0, 20); // Keep last 20 bids
        }
        return prev;
      });
    });

    // Listen for timer updates
    newSocket.on('timerUpdate', (timeLeft) => {
      setRemainingTime(timeLeft);
    });

    // Listen for auction start
    newSocket.on('auctionStarted', (duration) => {
      setRemainingTime(duration);
      setIsAuctionActive(true);
      toast.info(`Auction timer started for ${duration} seconds`);
    });

    // Listen for auction end
    newSocket.on('auctionEnded', () => {
      setIsAuctionActive(false);
      setRemainingTime(0);
      toast.success('Auction timer ended');
    });

    // Join as admin to get logs
    newSocket.emit('adminJoin');

    // Load initial data
    loadBidHistory();
    loadTeamStats();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const loadBidHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await adminAPI.getBidHistory();
      setBidHistory(history);
    } catch (error) {
      console.error('Error loading bid history:', error);
      toast.error('Failed to load bid history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadTeamStats = async () => {
    setIsLoadingStats(true);
    try {
      const stats = await adminAPI.getTeamStats();
      setTeamStats(stats);
    } catch (error) {
      console.error('Error loading team stats:', error);
      toast.error('Failed to load team statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleUpdatePOC = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await adminAPI.updateCurrentAuctionPOC({
        round,
        POC_name: currentPOC,
        max_amount: maxAmount
      });
      
      toast.success(`Updated current POC to ${currentPOC}`);
    } catch (error) {
      console.error('Error updating POC:', error);
      toast.error('Failed to update current POC');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellPOC = async () => {
    setIsSelling(true);
    
    try {
      await adminAPI.sellPOC();
      toast.success(`POC ${currentPOC} sold successfully!`);
      
      // Clear the current POC after selling
      setCurrentPOC('');
      setRound(prev => prev + 1);
      
      // Refresh stats after selling
      loadTeamStats();
    } catch (error) {
      console.error('Error selling POC:', error);
      toast.error('Failed to sell POC');
    } finally {
      setIsSelling(false);
    }
  };

  const startAuctionTimer = () => {
    if (socket && timerDuration > 0) {
      socket.emit('startAuction', timerDuration);
    } else {
      toast.error('Please set a valid timer duration');
    }
  };

  // Format time to display minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Auction Management</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          Round: {round}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gavel size={20} className="mr-2 text-blue-600" />
            Current Auction
          </h2>
          
          {currentPOC ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current POC</p>
                    <p className="text-xl font-bold text-gray-800">{currentPOC}</p>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Round {round}
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Max Bid Amount</p>
                    <p className="text-lg font-semibold text-gray-800">{maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Highest Bid</p>
                    <p className="text-lg font-semibold text-green-600">
                      {currentBid.amount > 0 
                        ? `${currentBid.amount} by ${currentBid.team || 'Unknown'}` 
                        : 'No bids yet'}
                    </p>
                  </div>
                </div>
                
                {/* Auction Timer Section */}
                <div className="mt-4 border-t border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Timer size={16} className="mr-2 text-blue-600" />
                      <p className="text-sm text-gray-500">Auction Timer</p>
                    </div>
                    <div className={`text-lg font-bold ${remainingTime > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                      {remainingTime > 0 ? formatTime(remainingTime) : 'Not started'}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="number"
                      value={timerDuration}
                      onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      min="5"
                      max="300"
                      disabled={isAuctionActive}
                    />
                    <span className="text-sm text-gray-500">seconds</span>
                    <button
                      onClick={startAuctionTimer}
                      disabled={isAuctionActive}
                      className="ml-auto px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isAuctionActive ? 'Timer Running' : 'Start Timer'}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSellPOC}
                disabled={isSelling}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isSelling ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Confirm Sale
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active auction</p>
              <p className="text-sm text-gray-400 mt-2">Set up a new POC for auction using the form</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign size={20} className="mr-2 text-green-600" />
            Set Up Next Auction
          </h2>
          
          <form onSubmit={handleUpdatePOC} className="space-y-4">
            <div>
              <label htmlFor="poc" className="block text-sm font-medium text-gray-700 mb-1">
                POC Name
              </label>
              <input
                type="text"
                id="poc"
                value={currentPOC}
                onChange={(e) => setCurrentPOC(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter POC name (e.g., A1)"
                required
              />
            </div>
            
            <div>
              <label htmlFor="round" className="block text-sm font-medium text-gray-700 mb-1">
                Round Number
              </label>
              <input
                type="number"
                id="round"
                value={round}
                onChange={(e) => setRound(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Bid Amount
              </label>
              <input
                type="number"
                id="maxAmount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="100"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Update Current POC'
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Bid History and Team Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center">
              <History size={16} className="mr-2" />
              Bid History
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('stats')}
          >
            <div className="flex items-center">
              <TrendingUp size={16} className="mr-2" />
              Team Statistics
            </div>
          </button>
        </div>
        
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <History size={18} className="mr-2 text-blue-600" />
              Recent Bids
            </h3>
            
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : bidHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No bid history available</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POC</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {bidHistory.map((bid) => (
              <tr key={bid._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bid.team_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.gitcoins}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.POC}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(bid.createdAt)}</td>
              </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={loadBidHistory}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Award size={18} className="mr-2 text-blue-600" />
              Team Performance
            </h3>
            
            {isLoadingStats ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : teamStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No team statistics available</p>
              </div>
            ) : (
              teamStats.map((team) => (
                <div key={team._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{team.team_name}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {team.POC.length} POCs
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-xs text-gray-500">Gitcoins</p>
                      <p className="text-lg font-semibold text-gray-800">{team.gitcoins}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-xs text-gray-500">POCs</p>
                      <ul className="text-lg font-semibold text-gray-800">
                        {team.POC.map((poc, index) => (
                          <li key={index}>{poc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={loadTeamStats}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Actions Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users size={20} className="mr-2 text-purple-600" />
          Admin Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">Add New Team</span>
            </div>
          </button>
          
          <button className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">Reset Auction</span>
            </div>
          </button>
          
          <button className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">Export Results</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionManagement;