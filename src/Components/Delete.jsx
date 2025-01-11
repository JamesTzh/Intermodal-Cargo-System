import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Deletestyle from "../CSS Files/Delete.module.css";
import axios from 'axios';




function Delete() {
    const [id, setId] = useState("");  // Store ID input
    const [cluster, setCluster] = useState("");  // Store Cluster input
    const [response, setResponse] = useState(null);  // Store API response
    const [error, setError] = useState(null);  // Store any error message

    const sendID_API_URL = 'http://127.0.0.1:5000/delete';  // Flask API endpoint
    const navigate = useNavigate();  // Navigation hook

    const sendDelete = async (event) => {
        event.preventDefault();  // Prevent page reload on form submission

        if (!id || !cluster) {
            setError("Both Cluster and ID are required!");  // Basic validation
            return;
        }

        try {
            console.log("Sending data to Flask:", { cluster, id });

            // Send POST request with the cluster and ID
            const res = await axios.post(
                sendID_API_URL,
                { cluster, id },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("Response from Flask:", res.data);
            setResponse(res.data);  // Store response in state
            setError(null);  // Clear previous errors

            // Optionally navigate back or to a confirmation page
            navigate(-1);  // Go back to the previous page
        } catch (err) {
            console.error("Error sending data:", err);
            setError(err.message);  // Store the error message
        }
    };

    return (
        <div className="main_main">
            <button
                onClick={() => navigate(-1)}  // Navigate back
                className={Deletestyle.back}
            >
                Back
            </button>
            <form onSubmit={sendDelete} className={Deletestyle.form}>
                <h1>Deleting Item</h1>
                <label className="block font-semibold">Cluster:</label>
                <input
                    type="text"
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="border w-full p-2 rounded"
                    placeholder="Enter Cluster"
                />
                <label className="block font-semibold">ID:</label>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="border w-full p-2 rounded"
                    placeholder="Enter ID"
                />
                <button
                    type="submit"
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            </form>

            {response && <p className="mt-4 text-green-600">{response.message}</p>}
            {error && <p className="mt-4 text-red-600">Error: {error}</p>}
        </div>
    );
}

export default Delete;