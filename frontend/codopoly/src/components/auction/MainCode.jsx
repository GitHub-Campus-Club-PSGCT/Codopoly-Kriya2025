import styles from '../../styles/bidding.module.css';
import BackButton from '../../assets/backbutton.png'
import { useState, useEffect } from 'react';
import axios from 'axios';

const MainPart = ({mainPart, setmainPart})=>{
    const handleClose = () => {
        setmainPart(false)
    };

    const [mainPOC, setMainPOC] = useState('');

    useEffect(()=>{

        const fetchMainPOC = async ()=>{
            try{
                const token = localStorage.getItem('codopoly_token');
                const response = await axios.get('http://localhost:3000/debug/poc', {
                    headers:{Authorization:`Bearer ${token}`}
                })
                let teamPOCs = response.data.teamPOCs;
                if(teamPOCs.length != 0){
                    setMainPOC(teamPOCs[0])
                }
                else{
                    setMainPOC('No Main Part Assigned!')
                }
            }
            catch(error){
                console.log(error);
                setMainPOC('Error fetching Main Part');
            }
        }
        fetchMainPOC();

    },[]);


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
                    <pre>{mainPOC.code}</pre>
                </div>
            </div>
        </>
    )
}

export default MainPart;