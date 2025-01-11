import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Cargoadded() {
    const location = useLocation();
    const { data } = location.state || {};  // Retrieve the processed data

    if (!data) {
        return <p>No data available. Please submit the form first.</p>;
    }

    return (
        <div className="container mx-auto text-center mt-20 bg-slate-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4">Cargo Successfully Added!</h1>
            <p className='text-2xl mb-2'>Cargo ID: {data.CargoID}</p>
            <p className='text-2xl mb-2'>Destination: {data.Destination}</p>
            <p className='text-2xl mb-6'>Cluster: {data.Cluster}</p>

            <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded mt-6">
                Back to Dashboard
            </Link>
        </div>
    );
}

export default Cargoadded;