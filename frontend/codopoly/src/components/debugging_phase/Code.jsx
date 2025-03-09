import React, { useEffect } from "react";
import axios from "axios";

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

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Current POC</h2>

            <h3 className="font-semibold text-center">{teamPOCs[currentPOCIndex].pocName}</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {teamPOCs[currentPOCIndex].code || "No code assigned"}
            </pre>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPOCIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPOCIndex === 0}
                    className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    ◀ Previous
                </button>

                <button
                    onClick={() => setCurrentPOCIndex((prev) => Math.min(prev + 1, teamPOCs.length - 1))}
                    disabled={currentPOCIndex === teamPOCs.length - 1}
                    className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Code;