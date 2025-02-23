import React, { useState } from "react";
import Code from "../components/debugging_phase/Code";
import AddDebugs from "../components/debugging_phase/AddDebugs";
import SubmittedDebugs from "../components/debugging_phase/SubmittedDebugs";

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
            <SubmittedDebugs
                questionTitle={teamPOCs[currentPOCIndex]?.questionTitle} // ✅ Correct key
                pocName={teamPOCs[currentPOCIndex]?.pocName} // ✅ Directly use pocName
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