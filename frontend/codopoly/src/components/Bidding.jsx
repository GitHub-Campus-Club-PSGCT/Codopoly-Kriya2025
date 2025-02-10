import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Bidding = () => {
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: '' });
  const [bidAmount, setBidAmount] = useState('');
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        if (!token) {
          alert('No token found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:3000/team/details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response);
        setTeamName(response.data.team_name);  // Assuming the response contains teamName
      } catch (error) {
        console.error('Failed to fetch team details:', error);
        alert('Failed to fetch team details.');
      }
    };

    fetchTeamDetails();

    socket.on('newBid', (bid) => {
      setCurrentBid(bid);
    });

    return () => socket.off('newBid');
  }, []);

  const handleBid = () => {
    if (!bidAmount) {
      alert('Please enter a bid amount.');
      return;
    }
    socket.emit('placeBid', { teamName, bidAmount: Number(bidAmount) });
    setBidAmount('');  // Clear the input field
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Bidding</h2>
      <p className="mb-2 text-lg font-semibold">Team: {teamName || 'Loading...'}</p>
      <p className="mb-4">Current Highest Bid: ₹{currentBid.amount} by {currentBid.team}</p>
      <div className="mb-4">
        <label className="block text-gray-700">Enter Your Bid</label>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button onClick={handleBid} className="w-full bg-green-500 text-white py-2 rounded-md">
        Place Bid
      </button>
    </div>
  );
};

export default Bidding;
