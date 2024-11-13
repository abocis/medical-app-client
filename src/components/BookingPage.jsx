import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Booking.css";

const BookingPage = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "http://localhost:8080/availability/all",
          {
            withCredentials: true,
          }
        );

        const availableSlots = response.data.flatMap((availability) => {
          const caregiverName = `${availability.caregiverId.firstName} ${availability.caregiverId.lastName}`;
          return availability.availableSlots.map((slot) => ({
            id: availability.id,
            time: slot,
            caregiverName: caregiverName,  
          }));
        });

        setAvailabilities(availableSlots);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Error fetching available times.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();  
  }, []);  
  return (
    <div className="booking-page">
      <h1>Available Time Slots</h1>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="availabilities-container">
        {availabilities.length === 0 && !loading ? (
          <p>No available time slots</p>
        ) : (
          availabilities.map((availability) => (
            <div
              key={`${availability.id}-${new Date(
                availability.time
              ).toISOString()}`}
              className="availability-item"
            >
              <p><strong>Caregiver:</strong> {availability.caregiverName}</p>
              <p><strong>Available Time:</strong> {new Date(availability.time).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingPage;
