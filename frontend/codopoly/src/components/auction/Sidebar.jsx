import styles from '../../styles/bidding.module.css';
import MainPart from './MainCode.jsx';
import {useNavigate} from 'react-router-dom';

const SideBar = ({ isOpen, mainPartOpen, setMainPartOpen }) => {

    const navigate = useNavigate();

    const handleMainPart = () => {
        setMainPartOpen(!mainPartOpen);
    }

    const handleOwnedCodes = ()=>{
        navigate('/ownedcodes');
    }

    return (
        <>
            <div className={`${styles.sidebarcontainer} ${isOpen ? styles.open : styles.closed}`}>
                <button className={styles.sidebarsubcontainer} onClick={handleMainPart}>Main Part</button>
                <button className={styles.sidebarsubcontainer} onClick={handleOwnedCodes}>Owned Codes</button>
            </div>
            <MainPart mainPart={mainPartOpen} setmainPart={setMainPartOpen} />
        </>
    )
}

export default SideBar;