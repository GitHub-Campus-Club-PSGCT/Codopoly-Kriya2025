import React, { useState } from "react";
import "./AddDebugs.css"; // External CSS for styling
import { serverAPI } from "../../api/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDebugs = ({ currentPOC, debugs, setDebugs }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!currentPOC) {
        return <p className="no-poc">No POC selected</p>;
    }

    const questionTitle = currentPOC.pocName.charAt(0);
    const pocName = currentPOC.pocName.charAt(1);

    const handleAddDebug = () => {
        const newDebugs = {
            ...debugs,
            [pocName]: [...(debugs[pocName] || []), { line: "", newCode: "" }],
        };
        setDebugs(newDebugs);
    };

    const handleUpdateDebug = (index, field, value) => {
        const updatedDebugs = [...(debugs[pocName] || [])];
        updatedDebugs[index][field] = value;

        setDebugs({ ...debugs, [pocName]: updatedDebugs });
    };

    const handleRemoveDebug = (index) => {
        const updatedDebugs = debugs[pocName].filter((_, i) => i !== index);
        setDebugs({ ...debugs, [pocName]: updatedDebugs });
    };

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);
    
            const token = localStorage.getItem("codopoly_token");
            if (!token) {
                setError("No token found, please log in");
                setLoading(false);
                toast.error("⚠️ No token found, please log in");
                return;
            }
    
            // ✅ Check if debugs array is empty before submission
            if (!debugs[pocName] || debugs[pocName].length === 0) {
                setLoading(false);
                toast.error("⚠️ No debugs to submit!");
                return;
            }
    
            const response = await serverAPI.submitDebug({
                questionTitle,
                pocName,
                debugs: debugs[pocName] || [],
            });
    
            toast.success("Debugs submitted successfully!");
    
            // Fetch updated debugs immediately after submission
            const updatedResponse = await serverAPI.getDebugs(questionTitle, pocName);
            setDebugs({ ...debugs, [pocName]: updatedResponse.data.debugs || [] });
    
        } catch (error) {
            console.error("Failed to submit debugs:", error);
            setError(error.response?.data?.message || "Failed to submit debugs.");
            toast.error("Failed to submit debugs!");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="debug-container">
            <h2 className="debug-title">Add Debugs for {pocName}</h2>
            {error && <p className="debug-error">{error}</p>}
            {loading && <p className="debug-loading">Submitting...</p>}

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
            <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                {loading ? "🚀 Submitting..." : "🚀 Submit Debugs"}
            </button>

            {/* Toast Container (Required for toast to work) */}
            <ToastContainer />
        </div>
    );
};

export default AddDebugs;
