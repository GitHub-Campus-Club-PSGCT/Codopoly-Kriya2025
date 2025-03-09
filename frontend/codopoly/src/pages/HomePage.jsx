import '../styles/homepage.css';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="container">
                <header className="header">
                    <h1 className="maintext">Welcome to Codopoly</h1>
                </header>
                <main className='content'>
                    <p className="text">
                        Codopoly is an exhilarating coding event consisting of three rounds. Each team starts with a main code
                        segment and receives two additional code segments which belong to other teams. The objective is to debug these
                        external codes and submit them to the auction. Success in Codopoly requires sharp debugging skills,
                        strategic thinking, and effective collaboration.
                    </p>
                    <div className="buttonContainer">
                        <button onClick={() => navigate('/debugging')} className="btn">Debug Code</button>
                        <button onClick={() => navigate('/bidding')} className="btn">Enter Auction</button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default HomePage;
