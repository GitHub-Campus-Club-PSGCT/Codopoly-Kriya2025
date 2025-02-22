import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Code = () => {
    const [teamPOCs, setTeamPOCs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://localhost:3000/debug/poc', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response);
                setTeamPOCs(response.data.teamPOCs);
            } catch (error) {
                console.error('Failed to fetch code:', error);
                setError('Failed to fetch code.');
            }
        };

        fetchCode();
    }, []);

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Team POCs</h2>
            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                teamPOCs.map((poc, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">{poc.pocName}</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                            {poc.code || "No code assigned"}
                        </pre>
                    </div>
                ))
            )}
        </div>
    );
}

export default Code;