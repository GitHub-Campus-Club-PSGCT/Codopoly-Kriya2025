import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Bidding = () => {
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: '' });
  const [newBidAmount, setNewBidAmount] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bidMessage, setBidMessage] = useState('');
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found. Please log in.');
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
        alert('Failed to fetch team details.');
        setIsLoading(false);
      }
    };

    fetchTeamDetails();

    socket.on('currentBid', (bid) => setCurrentBid(bid));
    socket.on('newBid', (bid) => setCurrentBid(bid));
    socket.on('bidFailed', (data) => setBidMessage(data.message));

    return () => {
      socket.off('currentBid');
      socket.off('newBid');
      socket.off('bidFailed');
    };
  }, []);

  const handleIncrementBid = (amount) => {
    setNewBidAmount((prev) => prev + amount);
    setShowConfirmBox(true);
  };

  const handleBid = () => {
    if (newBidAmount === 0) return;
    const finalBid = currentBid.amount + newBidAmount;
    setBidMessage('Placing your bid...');
    socket.emit('placeBid', { teamId, teamName, bidAmount: finalBid });
    setNewBidAmount(0);
    setShowConfirmBox(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Bidding</h2>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading team details...</p>
      ) : (
        <>
          <p className="mb-2 text-lg font-semibold">Team: {teamName || 'N/A'}</p>
          <p className="mb-4">Current Highest Bid: ₹{currentBid.amount} by {currentBid.team || 'N/A'}</p>
          
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[5, 10, 20, 30, 40].map((amount) => (
              <button
                key={amount}
                onClick={() => handleIncrementBid(amount)}
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                +₹{amount}
              </button>
            ))}
          </div>
          
          {showConfirmBox && (
            <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
              <p className="text-lg font-semibold text-center">Confirm your bid</p>
              <p className="text-center">New Bid Amount: ₹{currentBid.amount + newBidAmount}</p>
              <div className="flex justify-around mt-4">
                <button
                  onClick={handleBid}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Bid
                </button>
                <button
                  onClick={() => {
                    setNewBidAmount(0);
                    setShowConfirmBox(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {bidMessage && <p className="mt-4 text-center text-red-500">{bidMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Bidding;
