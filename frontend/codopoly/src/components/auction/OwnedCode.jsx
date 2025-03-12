import { useState, useEffect } from 'react';
import styles from '../../styles/ownedcodes.module.css';
import { serverAPI } from '../../api/API';

const OwnedCode = () => {
    const [ownedCodes, setOwnedCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnedCodes = async () => {
           try{
                const response = await serverAPI.getDebugPOC();
                let teamPOCs = response.data.teamPOCs;
                if (teamPOCs.length > 1) {
                    setOwnedCodes(teamPOCs.slice(1)); // skip the first element
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
