import styles from '../styles/bidding.module.css';
import Bidding from "../components/auction/Bidding.jsx";
import Header from "../components/auction/Header.jsx";
import AuctionCode from "../components/auction/AuctionCode.jsx";
import Score from '../components/auction/CurrentPoints.jsx';
import { useState } from 'react';

const BiddingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainPartOpen, setMainPartOpen] = useState(false);

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mainPartOpen={mainPartOpen}
        setMainPartOpen={setMainPartOpen}
      />
      <div className={`${styles.container} ${sidebarOpen || mainPartOpen ? styles.narrowed : ''}`}>
        <div className={styles.scoreContainer}>
          <Score />
        </div>
        <div className={styles.contentContainer}>
          <AuctionCode />
          <Bidding />
        </div>
      </div>
    </>
  )
}
export default BiddingPage;