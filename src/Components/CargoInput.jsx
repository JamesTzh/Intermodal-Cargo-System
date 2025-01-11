import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CargoInput = () => {
  const [cargoID, setCargoID] = useState("");
  const [destination, setDestination] = useState("");
  const [deadline, setDeadline] = useState("");
  const [load, setLoad] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(null);  // Track errors if any
  const [loading, setLoading] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const navigate = useNavigate(); // Use navigate to programmatically go back
  const addCargo_API_URL = 'http://127.0.0.1:5000/addcargo'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        CargoID: cargoID,
        Destination_Country: destination,
        DeadLine: deadline,
        Load: load,
        Type: type
      };

      console.log("Sending data to Flask:", payload);

      const res = await axios.post(addCargo_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      //const result = await res.json();
      console.log("Response from Flask:", res.data);
      setProcessedData(res.data.data);  // Store processed data in state
      setError(null);  // Clear any previous errors

      // Navigate to the confirmation page with processed data
      navigate("/cargoadded", { state: { data: res.data.data } });

    } catch (err) {
        console.error("Error sending data:", err);
        setError(err.message);
    } finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="container mx-auto overflow-y-auto"> 
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg"> 
        <h2 className="text-2xl font-bold mb-4">Cargo Management</h2>

        {/* Submit a Shipping Request */}
        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Submit a Shipping Request</h3>

          <div className="mb-4">
            <label className="block font-semibold">Cargo ID:</label>
            <input
              type="text"
              value={cargoID}
              onChange={(e) => setCargoID(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="Enter Cargo Id"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Destination:</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="Enter destination"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Deadline:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border w-full p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Load:</label>
            <input
              type="text"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="Enter Load"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Cargo Type:</label>
            <select className="border w-full p-2 rounded" onChange={(e) => setType(e.target.value)}>
            <option>Select Type</option>
              <option>Normal</option>
              <option>Refrigerated</option>
              <option>Dangerous</option>
              {/* Add more options if needed */}
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}  // Navigate to the previous page
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CargoInput;
