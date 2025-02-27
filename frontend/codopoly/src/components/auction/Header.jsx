import styles from '../../styles/bidding.module.css';
import SidebarBtn from '../../assets/sidebarbtn.png';
import SideBar from './Sidebar.jsx';

const Header = ({ sidebarOpen, setSidebarOpen, mainPartOpen, setMainPartOpen }) => {
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <div className={styles.header}>
                <button
                    onClick={toggleSidebar}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                    <img src={SidebarBtn} alt="Toggle Sidebar" className={styles.sidebarbtn} />
                </button>
                <p style={{ marginLeft: '45%', fontSize: 40 }} className={styles.maintext}>
                    Auction
                </p>
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