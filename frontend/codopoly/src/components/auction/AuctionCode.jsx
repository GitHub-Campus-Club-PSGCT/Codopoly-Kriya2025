import { useState, useEffect } from 'react';
import styles from '../../styles/bidding.module.css';
import axios from 'axios';
import {io} from 'socket.io-client';
const AuctionCode  = ()=>{
    const [currentPOCForSale, setCurrentPOCForSale] = useState('');
    useEffect(() => {
        const savedPOC = localStorage.getItem('currentPOC') || 'The code will be availabe when the auction starts';
        setCurrentPOCForSale(savedPOC);

        const socket = io('http://localhost:3001');
        socket.on('updatePOCSuccess', async (data) => {
          console.log(data.message);
          console.log('POC NAME : ', data.poc);
          const response = await axios.get(`http://localhost:3000/question/getPOC/${data.poc}`);
          console.log(response.data.poc);
          setCurrentPOCForSale(response.data.poc);
          localStorage.setItem('currentPOC', response.data.poc);
        });
        return () => {
          socket.disconnect();
        };
      }, []);

    return(
        <>
            <div className={styles.auctioncodecontainer}>
                <p style={{"margin":10, "fontSize":"1.5em"}} className={styles.maintext}>Auction Code</p>
                <div className={styles.auctioncodesubcontainer}>
                    {currentPOCForSale}
                </div>
            </div>

        </>
    )
}

export default AuctionCode;