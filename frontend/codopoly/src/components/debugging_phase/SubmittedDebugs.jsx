import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmittedDebugs = ({ questionTitle, pocName, teamId }) => {
    const [debugs, setDebugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDebugs = async () => {
            try {
                const token = localStorage.getItem("token");
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

    if (loading) return <p>Loading submitted debugs...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (debugs.length === 0) return <p>No debugs submitted yet.</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Submitted Debugs</h2>
            <ul className="space-y-2">
                {debugs.map((debug, index) => (
                    <li key={index} className="bg-green-100 p-2 rounded-md">
                        <strong>Line {debug.line}:</strong> {debug.newCode}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubmittedDebugs;