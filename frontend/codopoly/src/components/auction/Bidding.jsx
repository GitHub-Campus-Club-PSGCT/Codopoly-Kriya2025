import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from '../../styles/bidding.module.css';
import { socketAPI,serverAPI } from '../../api/API';
import {useNavigate} from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const Bidding = () => {
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

  const navigate = useNavigate();

  // 1. Fetch team details and connect socket on mount
  useEffect(() => {
    // Connect to socket
    socketAPI.connect();

    // Check for valid token
    const token = localStorage.getItem('codopoly_token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('codopoly_token'); // Remove expired token
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('codopoly_token'); // Remove invalid token
      navigate('/login');
    }

    // Fetch team details from backend
    const fetchTeamDetails = async () => {
      try {
        const response = await serverAPI.fetchTeam();
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

    // Cleanup on unmount
    return () => {
      socketAPI.disconnect();
    };
  }, []);

  // 2. Set up socket event listeners
  useEffect(() => {
    socketAPI.onCurrentBid((bid) => {
      console.log('Current bid received:', bid);
      setCurrentBid(bid);
    });

    socketAPI.onNewBid((bid) => {
      console.log('New bid received:', bid);
      setCurrentBid(bid);
      setBidMessage('');
    });

    socketAPI.onBidFailed((data) => {
      console.log('Bid failed:', data.message);
      setBidMessage(data.message);
      setShowConfirmBox(false);
    });

    socketAPI.onAuctionStatus((data) => {
      setAuctionStatus(data.message);
    });

    socketAPI.onTimerUpdate((timeLeft) => {
      setAuctionTimeLeft(timeLeft);
    });

    socketAPI.onAuctionStarted((data) => {
      setAuctionTimeLeft(data.time);
      setAuctionStatus('Auction in progress');
    });

    socketAPI.onSellPOCSuccess((data) => {
      setSellPOCDetails(data.message);
      setCurrentBid({ amount: 0, team: null });
      setAuctionStatus('Auction has ended');
    });

    socketAPI.onAuctionEnded(() => {
      setAuctionTimeLeft(0);
      setAuctionStatus('Auction has ended');
    });

    // Remove listeners on unmount
    return () => {
      socketAPI.offCurrentBid();
      socketAPI.offNewBid();
      socketAPI.offBidFailed();
      socketAPI.offAuctionStatus();
      socketAPI.offTimerUpdate();
      socketAPI.offAuctionStarted();
      socketAPI.offSellPOCSuccess();
      socketAPI.offAuctionEnded();
    };
  }, []);

  // 3. Bidding logic
  const handleIncrementBid = (amount) => {
    setNewBidAmount((prev) => prev + amount);
    setShowConfirmBox(true);
  };

  const handleBid = () => {
    if (newBidAmount === 0) return;
    setShowConfirmBox(false)
    setBidMessage('Placing your bid...');

    socketAPI.placeBid({
      teamId,
      teamName,
      bidAmount: currentBid.amount + newBidAmount,
    });
    setBidMessage('');
    setNewBidAmount(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <div className={styles.biddingcontainer}>
      <h2 className={styles.maintext}>Auction Bidding</h2>
      <div className={styles.biddingsubcontainer}>
        {auctionStatus && (
            <p className={`${styles.auctiontext} ${styles.highlighttext}`}>{auctionStatus}</p>
        )}

        {sellPOCDetails && (
            <p className={`${styles.auctiontext} ${styles.highlighttext} ${styles.textbold}`}>{sellPOCDetails}</p>
        )}

        {auctionTimeLeft > 0 && (
          <div className={styles.timer}>
            <Clock className={styles.clock} />
            <span className={auctionTimeLeft<10? `${styles.timered}`: `${styles.timegreen}`}>
              {formatTime(auctionTimeLeft)}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingcontainer}>
            <div className={styles.loadingspinner}></div>
          </div>
        ) : (
          <>
              <p className={`${styles.auctiontext} ${styles.textbold}`}>Your Team:</p>
              <p className={`${styles.auctiontext} ${styles.highlighttext}`}>{teamName || 'Not available'}</p>
              <p className={`${styles.auctiontext} ${styles.textbold}`}>Current Highest Bid:</p>
                <p className={`${styles.auctiontext} ${styles.highlighttext}`}>₹{currentBid.amount}</p>
                <p className={`${styles.auctiontext} ${styles.textbold}`}>
                  by <span className={`${styles.auctiontext} ${styles.highlighttext}`}>{currentBid.team || 'No bids yet'}</span>
                </p>

              <p className={`${styles.auctiontext} ${styles.textbold}`}>Increase bid by:</p>
              <div style={{"display":"flex", "flexDirection":"row", "gap":"10px"}}>
                {[5, 10, 20, 30, 40].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleIncrementBid(amount)}
                    className={styles.btn}
                    disabled={auctionTimeLeft === 0}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

            {showConfirmBox && (
              <div className={styles.bidconfirmationbox}>
                <p className={`${styles.auctiontext} ${styles.highlighttext}`} style={{"fontSize":"1.5rem","marginBottom":"20px"}}>Confirm your bid</p>
                <p className={styles.highlighttext} style={{"fontSize":"2rem","margin":0, "marginBottom":"20px"}}>₹{currentBid.amount + newBidAmount}</p>
                <div className={styles.bidconfirmbtncontainer}>
                  <button
                    onClick={handleBid}
                    className={styles.headerbutton}
                    style={{"margin":0}}
                  >
                    Place Bid
                  </button>
                  <button
                    onClick={() => {
                      setNewBidAmount(0);
                      setShowConfirmBox(false);
                    }}
                    className={styles.headerbutton}
                    style={{"margin":0}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {bidMessage && (
              <div className={styles.bidmessagecontainer}>
                <p className={`${styles.highlighttext}`} style={{"fontSize":"1.3rem"}}>Placing your Bid ... </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bidding;