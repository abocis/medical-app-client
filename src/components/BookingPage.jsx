import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/booking.css";

const BookingPage = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Hämta tider från backend
    const fetchAvailabilities = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/availability/all",
          {
            withCredentials: true,
          }
        );
        setAvailabilities(data);
      } catch (err) {
        console.error("failed to fetch under data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, []);

  const handleAvailabilityClick = (availability) => {
    setSelectedAvailability(availability);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    alert(`You booked: ${selectedAvailability.time}`);
    setShowConfirmation(false);
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="booking-page">
      <h1>Available Time Slots</h1>
      <div className="availabilities-container">
        {availabilities.map((availability) => (
          <div
            key={availability.id}
            className="availability-item"
            onClick={() => handleAvailabilityClick(availability)}
          >
            <p>{availability.time}</p>
          </div>
        ))}
      </div>

      {/* Bokningsbekräftelse-popup */}
      <div className={`book-confirmation ${showConfirmation ? "active" : ""}`}>
        <div className="book-confirmation-dialog">
          <h3>Confirm Booking</h3>
          <p>
            Are you sure you want to book the time:{" "}
            <strong>{selectedAvailability?.time}</strong>?
          </p>
          <div>
            <button onClick={handleConfirmBooking}>Confirm</button>
            <button onClick={handleCancelBooking}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
