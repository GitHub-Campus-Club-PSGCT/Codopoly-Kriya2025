import styles from '../../styles/bidding.module.css';

const AuctionCode  = ()=>{
    return(
        <>
            <div className={styles.auctioncodecontainer}>
                <p className={styles.maintext}>Auction Code</p>
                <div className={styles.auctioncodesubcontainer}>
                    {/*Use a api call here to get the auction code*/}
                </div>
            </div>

        </>
    )
}

export default AuctionCode;