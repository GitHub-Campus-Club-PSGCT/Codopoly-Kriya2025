import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Bidding = () => {
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: '' });
  const [bidAmount, setBidAmount] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bidMessage, setBidMessage] = useState('');
  const [auctionStatus, setAuctionStatus] = useState('');

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setBidMessage('No token found. Please log in.');
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

    // Socket event listeners
    socket.on('currentBid', (bid) => {
      setCurrentBid(bid);
      setBidMessage('');
    });

    socket.on('newBid', (bid) => {
      setCurrentBid(bid);
      setBidMessage('');
    });

    socket.on('bidFailed', (data) => {
      setBidMessage(data.message);
    });

    socket.on('auctionStatus', (data) => {
      setAuctionStatus(data.message);
    });

    socket.on('error', (data) => {
      setBidMessage(data.message);
    });

    return () => {
      socket.off('currentBid');
      socket.off('newBid');
      socket.off('bidFailed');
      socket.off('auctionStatus');
      socket.off('error');
    };
  }, []);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      setBidMessage('Please enter a valid bid amount.');
      return;
    }

    const numericBidAmount = Number(bidAmount);
    
    if (numericBidAmount <= currentBid.amount) {
      setBidMessage('Bid amount must be higher than the current bid.');
      return;
    }

    setBidMessage('Placing your bid...');
    socket.emit('placeBid', {
      teamId,
      teamName,
      bidAmount: numericBidAmount
    });
    setBidAmount('');
  };

  if (auctionStatus) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        <p className="text-center text-xl font-semibold text-red-600">{auctionStatus}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Live Auction Bidding</h2>
      
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading team details...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold">Your Team: {teamName || 'N/A'}</p>
            <div className="mt-2 text-lg">
              <span className="font-medium">Current Highest Bid: </span>
              <span className="text-green-600 font-bold">₹{currentBid.amount}</span>
              {currentBid.team && (
                <span className="text-gray-600 ml-2">by {currentBid.team}</span>
              )}
            </div>
          </div>

          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount (₹)
              </label>
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount in ₹"
                min={currentBid.amount + 1}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Place Bid
            </button>
          </form>

          {bidMessage && (
            <div className={`mt-4 p-3 rounded-md ${
              bidMessage.includes('Placing') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
            }`}>
              {bidMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bidding;