import React, { useEffect } from 'react';
import "./SubmittedDebugs.css"; // External CSS for styling
import { serverAPI } from '../../api/API';

const SubmittedDebugs = ({ questionTitle, pocName, debugs = {}, setDebugs }) => {
    useEffect(() => {
        const fetchDebugs = async () => {
            try {
                const token = localStorage.getItem("codopoly_token");
                if (!token) {
                    alert("No token found. Please log in.");
                    return;
                }

                const response = await serverAPI.getDebugs(questionTitle, pocName);
                // console.log("Fetched debugs:", response.data.debugs); // Debugging log

                // Ensure `setDebugs` correctly updates the previous state
                setDebugs(prevDebugs => ({
                    ...prevDebugs,
                    [pocName]: response.data.debugs || []
                }));
            } catch (error) {
                console.error("Error fetching debugs:", error);
            }
        };

        if (pocName) fetchDebugs();
    }, [questionTitle, pocName, setDebugs]);

    if (!debugs || !debugs[pocName] || debugs[pocName].length === 0) {
        return <p className="debug-no-data">No debugs submitted yet.</p>;
    }

    return (
        <div className="debugs-wrapper">
            <h2 className="debugs-header">Submitted Debugs</h2>
            <ul className="debugs-list">
                {debugs[pocName]?.map((debug, index) => (
                    <li key={index} className="debug-item">
                        <strong className="debug-line-num">Line {debug.line}:</strong>
                        <span className="debug-content">{debug.newCode}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubmittedDebugs;
