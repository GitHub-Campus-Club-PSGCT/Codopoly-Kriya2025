import styles from '../../styles/bidding.module.css';
import BackButton from '../../assets/backbutton.png'

const MainPart = ({mainPart, setmainPart})=>{
    const handleClose = () => {
        setmainPart(false)
    };

    return(
        <>
            <div className={`${styles.mainpartcontainer} ${mainPart ? styles.open : styles.closed}`}>
                <div className={styles.mainpartsubcontainer}>
                    <button
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        onClick={handleClose}
                    >
                        <img style={{"height":"20px"}} src={BackButton} alt="Toggle Sidebar" />
                    </button>
                    <p style={{"marginTop":10, "marginBottom":10, "marginLeft":"37%"}} className={styles.maintext}>Main Part</p>
                </div>
                <div className={styles.mainpart}>
                    {/*write a api call to get the user's main part of the code*/}
                </div>
            </div>
        </>
    )
}

export default MainPart;