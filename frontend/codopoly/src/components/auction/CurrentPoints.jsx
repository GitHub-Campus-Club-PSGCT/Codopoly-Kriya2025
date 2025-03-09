import styles from '../../styles/bidding.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Score = ()=>{
    const [gitcoins, setGitcoins] = useState(0);

    useEffect(() => {
        const fetchTeamGitcoins = async ()=>{
            const token = localStorage.getItem('codopoly_token');
            let teamsDetails = await axios.get('http://localhost:3000/team/details',{
                headers: {Authorization: `Bearer ${token}`}
            })
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