import React, { useState } from "react";
import "./AddDebugs.css"; // External CSS for styling
import { serverAPI } from "../../api/API";
const AddDebugs = ({ currentPOC, debugs, setDebugs }) => {
    const [error, setError] = useState(""); // Store error messages

    if (!currentPOC) {
        return <p className="no-poc">No POC selected</p>;
    }

    const questionTitle = currentPOC.pocName.charAt(0);
    const pocName = currentPOC.pocName.charAt(1);

    console.log("aaaaaa :", questionTitle, pocName);

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
            const token = localStorage.getItem("codopoly_token");
            if (!token) {
                setError("No token found, please log in");
                return;
            }

            const response = await serverAPI.submitDebug(
                {
                    questionTitle,
                    pocName,
                    debugs: debugs[pocName] || [],
                }
            );

            alert(response.data.message || "Debugs submitted successfully");
        } catch (error) {
            console.error("Failed to submit debugs:", error);
            setError(error.response?.data?.message || "Failed to submit debugs.");
        }
    };

    return (
        <div className="debug-container">
            <h2 className="debug-title">Add Debugs for {pocName}</h2>
            {error && <p className="debug-error">{error}</p>}

            {debugs[pocName]?.map((debug, index) => (
                <div key={index} className="debug-item">
                    <input
                        type="number"
                        placeholder="Line Number"
                        value={debug.line}
                        onChange={(e) => handleUpdateDebug(index, "line", e.target.value)}
                        className="debug-input"
                    />
                    <input
                        type="text"
                        placeholder="New Code"
                        value={debug.newCode}
                        onChange={(e) => handleUpdateDebug(index, "newCode", e.target.value)}
                        className="debug-input"
                    />
                    <button onClick={() => handleRemoveDebug(index)} className="remove-btn">❌</button>
                </div>
            ))}

            <button onClick={handleAddDebug} className="add-btn">➕ Add Debug</button>
            <button onClick={handleSubmit} className="submit-btn">🚀 Submit Debugs</button>
        </div>
    );
};

export default AddDebugs;
