import styles from '../../styles/bidding.module.css';

const Score = ()=>{
    return(
        <>
            <div className={styles.scorecontainer}>
                <p className={styles.maintext}>Your Score</p>
                <p className={styles.score}>{/*Use a API call here to obtain the score*/}1000</p>
            </div>
        </>
    )
}

export default Score;