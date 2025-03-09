import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Clock } from 'lucide-react';
import styles from '../../styles/bidding.module.css'

const Bidding = () => {
  const [socket, setSocket] = useState(null);
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: null });
  const [newBidAmount, setNewBidAmount] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bidMessage, setBidMessage] = useState('');
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [auctionTimeLeft, setAuctionTimeLeft] = useState(0);
  const [auctionStatus, setAuctionStatus] = useState('');
  const [sellPOCDetails, setSellPOCDetails] = useState('');

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    // Fetch team details
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('codopoly_token');
        if (!token) {
          setBidMessage('No token found. Please log in.');
          setIsLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/team/details', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTeamName(response.data.team_name);
        setTeamId(response.data._id);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch team details:', error);
        setBidMessage('Failed to fetch team details.');
        setIsLoading(false);
      }
    };

    fetchTeamDetails();

    // Clean up socket connection on component unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // Set up socket event listeners when socket is available
  useEffect(() => {
    if (!socket) return;

    // Listen for current bid updates
    socket.on('currentBid', (bid) => {
      console.log('Current bid received:', bid);
      setCurrentBid(bid);
    });

    // Listen for new bids
    socket.on('newBid', (bid) => {
      console.log('New bid received:', bid);
      setCurrentBid(bid);
      // Clear any previous bid message when a new bid is placed
      setBidMessage('');
    });

    // Listen for bid failures
    socket.on('bidFailed', (data) => {
      console.log('Bid failed:', data.message);
      setBidMessage(data.message);
      setShowConfirmBox(false);
    });

    // Listen for auction status
    socket.on('auctionStatus', (data) => {
      setAuctionStatus(data.message);
    });

    // Listen for timer updates
    socket.on('timerUpdate', (timeLeft) => {
      setAuctionTimeLeft(timeLeft);
    });

    // Listen for auction start
    socket.on('auctionStarted', async (data) => {
      setAuctionTimeLeft(data.time);
      setAuctionStatus('Auction in progress');
    });

    // Listen for sell POC success
    socket.on('sellPOCSuccess', (data) => {
      setSellPOCDetails(data.message);
      setCurrentBid({ amount: 0, team: null });
      setAuctionStatus('Auction has ended');
    });

    // Listen for auction end
    socket.on('auctionEnded', () => {
      setAuctionTimeLeft(0);
      setAuctionStatus('Auction has ended');
    });

    return () => {
      socket.off('currentBid');
      socket.off('newBid');
      socket.off('bidFailed');
      socket.off('auctionStatus');
      socket.off('timerUpdate');
      socket.off('auctionStarted');
      socket.off('sellPOCSuccess');
      socket.off('auctionEnded');
    };
  }, [socket]);

  const handleIncrementBid = (amount) => {
    setNewBidAmount((prev) => prev + amount);
    setShowConfirmBox(true);
  };

  const handleBid = () => {
    if (!socket || newBidAmount === 0) return;

    const finalBid = currentBid.amount + newBidAmount;
    setBidMessage('Placing your bid...');

    socket.emit('placeBid', {
      teamId,
      teamName,
      bidAmount: finalBid
    });

    setNewBidAmount(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.biddingcontainer}>
      <div className={styles.biddingsubcontainer}>
        <h2 className="text-2xl font-bold text-center mb-6">Auction Bidding</h2>

        {auctionStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-blue-800">{auctionStatus}</p>
            </div>
        )}

        {sellPOCDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-blue-800">{sellPOCDetails}</p>
          </div>
        )}

        {auctionTimeLeft > 0 && (
          <div className="flex items-center justify-center mb-4 bg-yellow-50 p-3 rounded-md">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" />
            <span className="text-xl font-semibold text-yellow-800">
              {formatTime(auctionTimeLeft)}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 mb-1">Your Team:</p>
              <p className="text-lg font-semibold">{teamName || 'Not available'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600 mb-1">Current Highest Bid:</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-green-600">₹{currentBid.amount}</p>
                <p className="text-gray-700">
                  by <span className="font-semibold">{currentBid.team || 'No bids yet'}</span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">Increase bid by:</p>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 20, 30, 40].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleIncrementBid(amount)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md transition-colors"
                    disabled={auctionTimeLeft === 0}
                  >
                    +₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {showConfirmBox && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <p className="text-gray-700 mb-2">Confirm your bid:</p>
                <p className="text-xl font-bold mb-4">₹{currentBid.amount + newBidAmount}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleBid}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Place Bid
                  </button>
                  <button
                    onClick={() => {
                      setNewBidAmount(0);
                      setShowConfirmBox(false);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {bidMessage && (
              <div className={`p-3 rounded-md ${bidMessage.includes('Failed') || bidMessage.includes('exceeds') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                {bidMessage}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bidding;