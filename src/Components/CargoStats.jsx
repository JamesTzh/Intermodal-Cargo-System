import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link component
import "../CSS Files/CargoStats.css";
import axios from "axios";

const CargoStats = () => {
  // Sample statistics data

  const Data_API_URL = 'http://127.0.0.1:5000'
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [flightsData, setFlightsData] = useState(0);
  const [shipsData, setShipsData] = useState(0);
  const [truckData, setTruckData] = useState(0);

  const fetchData = async () => {
    try {
      console.log("Fetching data from API...");
      const response = await axios.get(Data_API_URL, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      console.log("Received Data from API:", response.data);
      if (response.data.length > 0) {
        setData(response.data); // Update state with received data
        countShipments(response.data); // Count the number of each type
      } else {
        console.warn("Received an empty array from API.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  const countShipments = (data) => {
    const flights = data.filter(item => item.Transport_Mode === 'Plane').length;
    const ships = data.filter(item => item.Transport_Mode === 'Ship').length;
    const trucks = data.filter(item => item.Transport_Mode === 'Truck').length;

    setFlightsData(flights);
    setShipsData(ships);
    setTruckData(trucks);

    console.log(`Flights: ${flights}, Ships: ${ships}, Trucks: ${trucks}`);
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const stats = {
    outgoingShipments: {
      total: flightsData + shipsData + truckData,
      flights: flightsData,
      ships: shipsData,
      trucks: truckData,
    },
    averageTransitTime: "48 hours",
    onTimePercentage: "95%",
  };

  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>Loading...</p>;

  return (
    <div className="cargo-stats-container">
      <div className="header-container">
        <h2 className="stats-header">PSA Intermodal Cargo System</h2>
        {/* Button to navigate to the Dashboard */}
        <Link to="/dashboard" className="dashboard-button">Warehouse Dashboard</Link>
      </div>
      <div className="stats-cards">
        <div className="stat-card incoming">
          <h3>Incoming Shipments</h3>
          <p>Total: 58</p>
          <p>Plane: 10</p>
          <p>Ships: 35</p>
          <p>Trucks: 13</p>
        </div>
        <div className="stat-card outgoing">
          <h3>Outgoing Shipments</h3>
          <p>Total: {stats.outgoingShipments.total}</p>
          <p>Plane: {stats.outgoingShipments.flights}</p>
          <p>Ships: {stats.outgoingShipments.ships}</p>
          <p>Trucks: {stats.outgoingShipments.trucks}</p>
        </div>
        <div className="stat-card">
          <h3>Average Transit Time</h3>
          <p>{stats.averageTransitTime}</p>
        </div>
        <div className="stat-card">
          <h3>On-Time Delivery Percentage</h3>
          <p>{stats.onTimePercentage}</p>
        </div>
      </div>

      {/* Warehouse Capacity Section */}
      <div className="warehouse-capacity">
        <h3>Capacities</h3>
        <table>
          <thead>
            <tr>
              <th>Storage</th>
              <th>Capacity</th>
              <th>Current Load</th>
              <th>Available Space</th>
            </tr>
          </thead>
          <tbody>
            {data.map((info) => (
              <tr key={info.Name}>
                <td>{info.Name}</td>
                <td>{info.Max_Capacity}</td>
                <td>{info.Total_Load}</td>
                <td>{info.Max_Capacity - info.Total_Load}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CargoStats;
