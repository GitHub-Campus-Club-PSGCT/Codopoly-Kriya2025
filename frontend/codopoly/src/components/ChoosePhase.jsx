import styles from '../styles/choosephase.module.css';
import {useNavigate} from 'react-router-dom';
import Logo from '../assets/Logo.png'

const PhaseChoose = ()=>{
    const navigate = useNavigate();

    const handleClick = (to)=>{
        navigate(`${to}`)
    }

    return(
        <div className={styles.maincontainer}>
            <div className={styles.gameContainer}>
                <img src={Logo} className={styles.gameTitle}/>
                <p className={styles.gameSubtitle}>
                    Welcome to the ultimate coding board game! Choose your next move wisely.
                </p>

                <div className={styles.choosephasecontainer}>
                    <button className={styles.button} onClick={()=>handleClick('/debugging')}>
                        Debugging Phase
                    </button>
                    <button className={styles.button} onClick={()=>handleClick('/bidding')}>
                        Auction Phase
                    </button>
                    <button className={styles.button} onClick={()=>{handleClick('/leaderboards')}}>LeaderBoards</button>
                </div>

                <p className={styles.footerText}>
                    Trade properties, fix bugs, and become the ultimate code tycoon!
                </p>
            </div>
        </div>
    )
}

export default PhaseChoose;