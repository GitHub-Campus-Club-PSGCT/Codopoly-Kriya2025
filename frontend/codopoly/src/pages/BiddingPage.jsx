import styles from '../styles/bidding.module.css';
import Bidding from "../components/auction/Bidding.jsx";
import Header from "../components/auction/Header.jsx";
import AuctionCode from "../components/auction/AuctionCode.jsx";
import Score from '../components/auction/CurrentPoints.jsx';
import Timer from '../components/auction/Timer.jsx';
import { useState } from 'react';

const MAX_CODES = 10; // Assuming 10 codes are to be auctioned , change as required

const BiddingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainPartOpen, setMainPartOpen] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [codeIndex, setCodeIndex] = useState(0);

  const handleTimerReset = () => {
    if (codeIndex < MAX_CODES) {
      setFetchTrigger(prev => prev + 1);
      setCodeIndex(prev => prev + 1);
    }
  };

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mainPartOpen={mainPartOpen}
        setMainPartOpen={setMainPartOpen}
      />

      <div className={`${styles.container} ${sidebarOpen || mainPartOpen ? styles.narrowed : ''}`}>
        <div className = {styles.timer}>
          {codeIndex < MAX_CODES && <Timer onTimerReset={handleTimerReset} />}
        </div>
        <div className={styles.scoreContainer}>
          <Score />
        </div>
        <div className={styles.contentContainer}>
          <AuctionCode triggerFetch={fetchTrigger} codeIndex={codeIndex} maxCodes={MAX_CODES} />
          <Bidding />
        </div>
      </div>
    </>
  )
}

export default BiddingPage;