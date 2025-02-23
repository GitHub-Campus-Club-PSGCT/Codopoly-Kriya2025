import React, { useState } from "react";
import Code from "../components/debugging_phase/Code";
import AddDebugs from "../components/debugging_phase/AddDebugs";

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
            <AddDebugs
                currentPOC={teamPOCs[currentPOCIndex]} // Pass the currently displayed POC
                debugs={debugs}
                setDebugs={setDebugs}
            />
        </>
    );
};

export default DebuggingPage;