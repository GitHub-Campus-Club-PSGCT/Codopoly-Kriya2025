import { useState, useEffect } from 'react';
import styles from '../../styles/ownedcodes.module.css';
import axios from 'axios';

const OwnedCode = () => {
    const [ownedCodes, setOwnedCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnedCodes = async () => {
           try{
                const token = localStorage.getItem('codopoly_token')
                const resposne = await axios.get('http://localhost:3000/debug/poc',{
                    headers:{Authorization:`Bearer ${token}`}
                })
                let teamPOCs = resposne.data.teamPOCs;
                if(teamPOCs.length >1){
                    setOwnedCodes(teamPOCs)
                }
                setLoading(false)
           }
           catch(error){
            console.log(error);
            setError('Failed to Fetch Owned Codes');
           }
        };

        fetchOwnedCodes();
    }, []);

    if (loading) {
        return <div className={styles.loadingText}>Loading your codes...</div>;
    }

    if (error) {
        return <div className={styles.errorText}>{error}</div>;
    }

    if (ownedCodes.length === 0) {
        return <div className={styles.emptyText}>You don't own any codes yet.</div>;
    }

    return (
        <div className={styles.codesContainer}>
            {ownedCodes.map((code, index) => (
                <div key={index} className={styles.codeCard}>
                    <pre className={styles.codeContent}>
                        {code.code}
                    </pre>
                </div>
            ))}
        </div>
    );
};

export default OwnedCode;
