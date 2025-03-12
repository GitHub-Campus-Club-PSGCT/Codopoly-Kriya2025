import styles from '../../styles/bidding.module.css';
import { useEffect, useState } from 'react';
import { serverAPI } from '../../api/API';

const Score = ()=>{
    const [gitcoins, setGitcoins] = useState(0);

    useEffect(() => {
        const fetchTeamGitcoins = async ()=>{
            let teamsDetails = await serverAPI.fetchTeam();
            setGitcoins(parseInt(teamsDetails.data.gitcoins));
        }
        fetchTeamGitcoins(); // Add this line to call the function
    }, []);

    return(
        <>
            <div className={styles.scorecontainer}>
                <p  style = {{"margin":0}} className={styles.maintext}>Your GitCoins</p>
                <p className={styles.score}>{gitcoins}</p>
            </div>
        </>
    )
}

export default Score;