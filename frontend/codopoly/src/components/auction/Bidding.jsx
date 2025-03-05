import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import styles from '../../styles/bidding.module.css';
const socket = io('http://localhost:3000');

const Bidding = () => {
  const [currentBid, setCurrentBid] = useState({ amount: 0, team: '' });
  const [newBidAmount, setNewBidAmount] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(false); //set for false for styling
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
    <div className={styles.biddingcontainer}>
      <h2 className={styles.maintext}>Bidding</h2>
      {isLoading ? (
        <p className={styles.text}>Loading team details...</p>
      ) : (
        <>
          <p className={styles.text}>Team: {teamName || 'N/A'}</p>
          <p className={styles.text}>Current Highest Bid: ₹{currentBid.amount} by {currentBid.team || 'N/A'}</p>
          <div className={styles.amtcont}>
            {[5, 10, 20, 30, 40].map((amount) => (
              <button
                key={amount}
                onClick={() => handleIncrementBid(amount)}
                className={styles.btn}
              >
                +₹{amount}
              </button>
            ))}
          </div>
          {showConfirmBox && (
            <div className={styles.confirmbox}>
              <p className={styles.text}>Confirm your bid</p>
              <p className={styles.text}>New Bid Amount: ₹{currentBid.amount + newBidAmount}</p>
              <div className={styles.bidconfrmcontainer}>
                <button
                  onClick={handleBid}
                  className={styles.btn}
                >
                  Bid
                </button>
                <button
                  onClick={() => {
                    setNewBidAmount(0);
                    setShowConfirmBox(false);
                  }}
                  className={styles.btn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {bidMessage && <p className={styles.text}>{bidMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Bidding;