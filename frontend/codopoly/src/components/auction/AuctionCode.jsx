import { useState, useEffect} from "react";
import styles from '../../styles/bidding.module.css';

const AuctionCode = ({ triggerFetch, codeIndex, maxCodes }) => {
    const fetchAuctionCode = async () => {
        if (codeIndex < maxCodes) {  
            // API call to get code to auction
        }
    };

    useEffect(() => {
        if (codeIndex < maxCodes) {  
            fetchAuctionCode();
        } 
    }, [triggerFetch, codeIndex, maxCodes]); // fetch called every time, timer resets
    
    return(
        <>
            <div className={styles.auctioncodecontainer}>
                <p style={{"margin":10}} className={styles.maintext}>Auction Code</p>
                <div className={styles.auctioncodesubcontainer}>
                    {/* Display fetches auction code */}
                </div>
            </div>

        </>
    )
}

export default AuctionCode;