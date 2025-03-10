import React, { useState } from "react";
import Code from "../components/debugging_phase/Code";
import AddDebugs from "../components/debugging_phase/AddDebugs";
import SubmittedDebugs from "../components/debugging_phase/SubmittedDebugs";
import './Debugging.css'

const DebuggingPage = () => {
    const [teamPOCs, setTeamPOCs] = useState([]); // Store all POCs
    const [currentPOCIndex, setCurrentPOCIndex] = useState(0); // Track which POC is displayed
    const [debugs, setDebugs] = useState({}); // Store debugs per POC

    return (
        <>
            <Code
                teamPOCs={teamPOCs}
                setTeamPOCs={setTeamPOCs}
                currentPOCIndex={currentPOCIndex}
                setCurrentPOCIndex={setCurrentPOCIndex}
            />

<div className="debug-section">
    <SubmittedDebugs 
        questionTitle={teamPOCs[currentPOCIndex]?.pocName.charAt(0)}
        pocName={teamPOCs[currentPOCIndex]?.pocName.charAt(1)}
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