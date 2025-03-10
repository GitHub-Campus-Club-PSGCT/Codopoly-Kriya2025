import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SubmittedDebugs.css"; // External CSS for styling

const SubmittedDebugs = ({ questionTitle, pocName, teamId }) => {
    const [debugs, setDebugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDebugs = async () => {
            try {
                const token = localStorage.getItem("codopoly_token");
                if (!token) {
                    alert("No token found. Please log in.");
                    return;
                }

                const response = await axios.get('http://localhost:3000/debug/getdebugs', {
                    params: { questionTitle, pocName },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDebugs(response.data.debugs || []);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDebugs();
    }, [questionTitle, pocName, teamId]);

    if (loading) return <p className="debug-loading">Loading submitted debugs...</p>;
    if (error) return <p className="debug-error">Error: {error}</p>;
    if (debugs.length === 0) return <p className="debug-no-data">No debugs submitted yet.</p>;

    return (
        <div className="debugs-wrapper">
            <h2 className="debugs-header">Submitted Debugs</h2>
            <ul className="debugs-list">
                {debugs.map((debug, index) => (
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
