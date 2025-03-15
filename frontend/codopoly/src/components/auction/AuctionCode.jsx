import { useState, useEffect } from 'react';
import styles from '../../styles/bidding.module.css';
import { socketAPI ,serverAPI} from '../../api/API';

const AuctionCode = () => {
  const [currentPOCForSale, setCurrentPOCForSale] = useState('');

  useEffect(() => {
    const savedPOC = localStorage.getItem('currentPOC') || 'The code will be available when the auction starts';
    setCurrentPOCForSale(savedPOC);
    socketAPI.connect();

    socketAPI.onUpdatePOCSuccess(async (data) => {
      console.log('POC Update:', data.message);
      console.log('POC NAME:', data.poc);

      try {
        const response = await serverAPI.getPOC(data.poc);
        console.log('Fetched POC:', response.data.poc);
        setCurrentPOCForSale(response.data.poc);
        localStorage.setItem('currentPOC', response.data.poc);
      } catch (error) {
        console.error('Error fetching POC:', error);
      }
    });

    socketAPI.onAuctionEnded(() => {
      localStorage.setItem('currentPOC', 'Auctioning POC will be announced soon..!');
    });

    return () => {
      socketAPI.disconnect();
    };
  }, []);

  // Process the POC string to remove everything up to the first closing parenthesis
  const processedPOC = currentPOCForSale.includes('(')
    ? currentPOCForSale.substring(currentPOCForSale.indexOf('(')).trim()
    : currentPOCForSale;

  return (
    <div className={styles.auctioncodecontainer}>
      <p style={{ margin: 10, fontSize: '1.5em' }} className={styles.maintext}>Auction Code</p>
      <div className={styles.auctioncodesubcontainer}>
        <pre className={styles.codeblock}>
          {processedPOC}
        </pre>
      </div>
    </div>
  );
};

export default AuctionCode;
