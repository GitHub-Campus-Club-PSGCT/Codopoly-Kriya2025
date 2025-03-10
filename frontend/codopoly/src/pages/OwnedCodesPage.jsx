import styles from '../styles/ownedcodes.module.css';
import OwnedCode from '../components/auction/OwnedCode';

const OwnedCodesPage = () => {
    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Owned Codes</h1>
            </div>
            <div className={styles.pageContainer}>
                <OwnedCode />
            </div>
        </>
    )
}

export default OwnedCodesPage;
