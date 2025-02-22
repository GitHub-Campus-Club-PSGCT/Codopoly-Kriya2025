import React, { useState } from "react";
import axios from "axios";

const AddDebugs = ({ currentPOC, debugs, setDebugs }) => {
    const [error, setError] = useState(""); // Store error messages

    if (!currentPOC) {
        return <p className="text-center text-red-500">No POC selected</p>;
    }

    const questionTitle = currentPOC.pocName.charAt(0);
    const pocName = currentPOC.pocName.charAt(1);

    console.log('aaaaaa :',questionTitle, pocName);

    const handleAddDebug = () => {
        setDebugs({
            ...debugs,
            [pocName]: [...(debugs[pocName] || []), { line: "", newCode: "" }],
        });
    };

    const handleUpdateDebug = (index, field, value) => {
        const updatedDebugs = [...(debugs[pocName] || [])];
        updatedDebugs[index][field] = value;

        setDebugs({ ...debugs, [pocName]: updatedDebugs });
    };

    const handleRemoveDebug = (index) => {
        setDebugs({
            ...debugs,
            [pocName]: debugs[pocName].filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async () => {
        try {
            setError(""); // Clear previous errors
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found, please log in");
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/debug/submit",
                {
                    questionTitle,
                    pocName,
                    debugs: debugs[pocName] || [],
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert(response.data.message || "Debugs submitted successfully");
        } catch (error) {
            console.error("Failed to submit debugs:", error);
            setError(error.response?.data?.message || "Failed to submit debugs.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">
                Add Debugs for {pocName}
            </h2>

            {/* Display Errors */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {debugs[pocName]?.map((debug, index) => (
                <div key={index} className="mb-4 border p-2 rounded">
                    <input
                        type="number"
                        placeholder="Line Number"
                        value={debug.line}
                        onChange={(e) => handleUpdateDebug(index, "line", e.target.value)}
                        className="border p-2 rounded mr-2"
                    />
                    <input
                        type="text"
                        placeholder="New Code"
                        value={debug.newCode}
                        onChange={(e) => handleUpdateDebug(index, "newCode", e.target.value)}
                        className="border p-2 rounded"
                    />
                    <button onClick={() => handleRemoveDebug(index)} className="ml-2 text-red-500">
                        ❌ Remove
                    </button>
                </div>
            ))}

            <button onClick={handleAddDebug} className="bg-blue-500 text-white px-4 py-2 rounded">
                ➕ Add Debug
            </button>

            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                🚀 Submit Debugs
            </button>
        </div>
    );
};

export default AddDebugs;