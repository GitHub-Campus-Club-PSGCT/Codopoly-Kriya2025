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

    socket.on('currentBid', (bid) => {
      setCurrentBid(bid);
    });

    socket.on('newBid', (bid) => {
      setCurrentBid(bid);
    });

    socket.on('bidFailed', (data) => {
      setBidMessage(data.message);
    });

    return () => {
      socket.off('currentBid');
      socket.off('newBid');
      socket.off('bidFailed');
    };
  }, []);

  const handleBid = () => {
    if (!bidAmount || bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    setBidMessage('Placing your bid...');
    socket.emit('placeBid', { teamId, teamName, bidAmount: Number(bidAmount) });
    setBidAmount('');  // Clear the input field
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
          <div className="mb-4">
            <label className="block text-gray-700">Enter Your Bid</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
              min="1"
            />
          </div>
          <button onClick={handleBid} className="w-full bg-green-500 text-white py-2 rounded-md">
            Place Bid
          </button>
          {bidMessage && <p className="mt-4 text-center text-red-500">{bidMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Bidding;
