import styles from '../../styles/bidding.module.css';
import SidebarBtn from '../../assets/sidebarbtn.png';
import SideBar from './Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen, mainPartOpen, setMainPartOpen}) => {

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleRedirect = ()=>{
        navigate('/debugging')
    }

    return (
        <>
            <div className={styles.header}>
                <button
                    onClick={toggleSidebar}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    <img src={SidebarBtn} alt="Toggle Sidebar" className={styles.sidebarbtn} />
                </button>
                <p style={{"fontSize": "2em" }} className={styles.maintext}>
                    Auction
                </p>
                <button className={styles.headerbutton} onClick={handleRedirect}>
                Debugging
                </button>
            </div>
            <SideBar
                isOpen={sidebarOpen}
                mainPartOpen={mainPartOpen}
                setMainPartOpen={setMainPartOpen}
            />
        </>
    );
}

export default Header;