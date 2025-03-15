import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Code from "../components/debugging_phase/Code";
import AddDebugs from "../components/debugging_phase/AddDebugs";
import SubmittedDebugs from "../components/debugging_phase/SubmittedDebugs";
import './Debugging.css';

const DebuggingPage = () => {
    const navigate = useNavigate();
    const [teamPOCs, setTeamPOCs] = useState([]); // Store all POCs
    const [currentPOCIndex, setCurrentPOCIndex] = useState(0); // Track which POC is displayed
    const [debugs, setDebugs] = useState({}); // Store debugs per POC

    return (
        <>
            {/* Header with Navigation Buttons */}
            <header className="debug-header">
                <h1>Debugging Phase</h1>
                <div className="nav-buttons">
                    <button onClick={() => navigate('/bidding')}>Auctioning Page</button>
                    <button onClick={() => navigate('/login')}>Logout</button>
                    <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
                </div>
            </header>

            <Code
                teamPOCs={teamPOCs}
                setTeamPOCs={setTeamPOCs}
                currentPOCIndex={currentPOCIndex}
                setCurrentPOCIndex={setCurrentPOCIndex}
            />

            <div className="debug-section">
                <SubmittedDebugs 
                    questionTitle={teamPOCs[currentPOCIndex]?.pocName?.charAt(0)}
                    pocName={teamPOCs[currentPOCIndex]?.pocName?.charAt(1)}
                />
                <AddDebugs 
                    currentPOC={teamPOCs[currentPOCIndex]} 
                    debugs={debugs} 
                    setDebugs={setDebugs} 
                />
            </div>
        </>
    );
};

export default DebuggingPage;
