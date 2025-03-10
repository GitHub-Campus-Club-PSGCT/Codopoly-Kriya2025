import React, { useEffect } from "react";
import axios from "axios";
import './Code.css'

const Code = ({ teamPOCs, setTeamPOCs, currentPOCIndex, setCurrentPOCIndex }) => {
    useEffect(() => {
        const fetchCode = async () => {
            try {
                const token = localStorage.getItem("codopoly_token");
                if (!token) {
                    alert("No token found. Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:3000/debug/poc", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setTeamPOCs(response.data.teamPOCs);
            } catch (error) {
                console.error("Failed to fetch code:", error);
            }
        };

        fetchCode();
    }, [setTeamPOCs]);

    if (teamPOCs.length === 0) {
        return <p className="text-center text-gray-500">No POCs available.</p>;
    }

    const codeLines = (teamPOCs[currentPOCIndex].code || "No code assigned").split("\n");

    return (
        <div className="code-container">
            <h2 className="code-title">Current POC</h2>
            <h3 className="poc-name">{teamPOCs[currentPOCIndex].pocName}</h3>

            {/* Code Block */}
            <pre className="code-block">
                {codeLines.map((line, index) => (
                    <div key={index} className="code-line">
                        <span className="line-number">{index + 1}.</span>
                        <span className="code-text">{line}</span>
                    </div>
                ))}
            </pre>

            {/* Navigation Buttons */}
            <div className="nav-buttons">
                <button
                    onClick={() => setCurrentPOCIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPOCIndex === 0}
                    className="nav-button"
                >
                    ◀ Previous
                </button>
                <button
                    onClick={() => setCurrentPOCIndex((prev) => Math.min(prev + 1, teamPOCs.length - 1))}
                    disabled={currentPOCIndex === teamPOCs.length - 1}
                    className="nav-button"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Code;
