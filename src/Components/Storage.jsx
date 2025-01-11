import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cargo from './Cargo';
import Storagestyle from "../CSS Files/Storage.module.css";
import axios from 'axios';

function Storage() {
    const { id } = useParams();  // Get 'id' from URL parameters
    const [response, setResponse] = useState(null);  // Store Flask response
    const [error, setError] = useState(null);  // Track any errors
    const sendID_API_URL = 'http://127.0.0.1:5000/storage';  // Flask endpoint

    const sendID = async () => {
        try {
            console.log("Sending data to Flask on page load:", id);  // Log the ID

            // Send POST request with JSON body
            const res = await axios.post(sendID_API_URL, { id }, {
                headers: {
                    'Content-Type': 'application/json'  // Ensure proper headers
                }
            });

            console.log("Response from Flask:", res.data);  // Log the response
            setResponse(res.data);  // Store the response in state
        } catch (err) {
            console.error("Error sending data:", err);  // Log any errors
            setError(err.message);  // Store the error in state
        }
    };

    useEffect(() => {
        console.log("useEffect triggered");  // Confirm useEffect is running
        sendID();  // Call the function on component mount
    }, []);  // Run only once on mount

    // Handle loading and error states
    if (error) return <p>Error: {error}</p>;  // Display error if present
    if (!response) return <p>Loading...</p>;  // Show loading state initially

    return (
        <>
            <div className={Storagestyle.main_main}>
                <div className={Storagestyle.header}>
                    <h1>{id}</h1>
                </div>
                <div className={Storagestyle.btn_container}>
                    <Link to="/dashboard" className={Storagestyle.back}>Back</Link>
                    <div className={Storagestyle.storage_info}>
                        <div>Load: {response.Total_Load}/{response.Max_Capacity}</div>
                        <div>Transport Mode: {response.Transport_Mode}</div>
                        <div>Shipping Date: {response.Shipping_Date}</div>
                    </div>
                    <Link to="/delete" className={Storagestyle.del}>Delete Item</Link>
                </div>

                <div className={Storagestyle.cargo_container}>
                    {response.Items.map((cargo) => <Cargo information={cargo} key={cargo.CargoID}/>)}
                </div>
            </div>
        </>  
    )
}

export default Storage;