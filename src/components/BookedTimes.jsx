import React, { useState, useEffect } from "react";
import axios from "axios";

const BookedTimes = () => {
  // State to hold fetched data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/appointments/caregiver/672b6d5180c0fd484157b920"
      ); // Replace with your backend API endpoint
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // useEffect to run fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this will run once on mount

  // Render based on loading/error state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="data-container">
        {/* Display fetched data */}
        {data.map((item) => (
          <div key={item.id} className="data-item">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookedTimes;
