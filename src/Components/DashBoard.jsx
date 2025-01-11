import React, {useState, useEffect} from 'react';
import dashboardstyle from "../CSS Files/Dashboard.module.css"
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    
    const [data, setData] = useState([]);  // Start with 'null' to differentiate loading state
    const [error, setError] = useState(null);  // Track errors if any
    const DashboardAPI_URL = 'http://127.0.0.1:5000/';  // Flask API URL

    const fetchData = async () => {
        try {
            console.log("Fetching data from API...");
            const response = await axios.get(DashboardAPI_URL, {
                headers: {
                    'Cache-Control': 'no-cache',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            });

            console.log("Received Data from API:", response.data);
            if (response.data.length > 0) {
                setData(response.data);  // Update state with received data
                console.log("State Updated with Data:", response.data);
            } else {
                console.warn("Received an empty array from API.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();  // Fetch data when component mounts
    }, []);  // Run only once on mount

    // Log the state whenever it changes
    useEffect(() => {
        console.log("Data after state update:", data[0]);
    }, [data]);

    if (error) return <p>Error: {error}</p>;  // Display error if present
    if (!data.length) return <p>Loading...</p>;  // Show loading state initially

    return (
        <>
            <div className={dashboardstyle.main_main}>
                <div className={dashboardstyle.header}>
                    <h1>Warehouse Dashboard</h1>
                </div>
                <div className={dashboardstyle.btn_container}>
                    {/* Back Button */}
                    <Link to='/' className={dashboardstyle.back_button}>Back</Link>
                </div>
                <div className={dashboardstyle.btn_container_right}>
                    {/* Add Item Button */}
                    <Link to='/input' className={dashboardstyle.add_items}>Add Item</Link>
                </div>
                <div className={dashboardstyle.storage_container}>
                    {data.map((info) => (
                        <Link to={'/storage/' + info.Name} key={info.Name} className={dashboardstyle.storage_box}>
                            {info.Name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Dashboard;