import styles from '../../styles/bidding.module.css';
import MainPart from './MainCode.jsx';

const SideBar = ({ isOpen, mainPartOpen, setMainPartOpen }) => {
    const handleMainPart = () => {
        setMainPartOpen(!mainPartOpen);
    }

    return (
        <>
            <div className={`${styles.sidebarcontainer} ${isOpen ? styles.open : styles.closed}`}>
                <button className={styles.sidebarsubcontainer} onClick={handleMainPart}>Main Part</button>
                <button className={styles.sidebarsubcontainer}>Owned Codes</button>
            </div>
            <MainPart mainPart={mainPartOpen} setmainPart={setMainPartOpen} />
        </>
    )
}

export default SideBar;