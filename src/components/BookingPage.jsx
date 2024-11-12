import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Booking.css";

const BookingPage = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newTime, setNewTime] = useState("");

  // Hämtar tillgängliga tider från backend
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/availability/all",
          {
            withCredentials: true,
          }
        );

        console.log("Fetched response from backend:", response);

        // Extrahera tillgängliga tider från servern
        const availableSlots = response.data.flatMap((availability) => {
          return availability.availableSlots.map((slot) => ({
            id: availability.id,
            time: slot,
          }));
        });

        console.log("Filtered availabilities:", availableSlots);
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

  const addNewTimeSlot = async () => {
    if (!newTime) {
      alert("Please enter a valid time.");
      return;
    }

    const newSlot = new Date(newTime);

    const availabilityDTO = {
      caregiverId: "caregiver-id-here",
      availableSlots: [newSlot],
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/availability",
        availabilityDTO
      );
      console.log("Added new availability:", response);

      setAvailabilities((prev) => [
        ...prev,
        { id: response.data.id, time: response.data.availableSlots[0] },
      ]);
      setNewTime("");
    } catch (error) {
      console.error("Error adding new time slot:", error);
      alert("Error adding new time slot.");
    }
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

      {/* Visa ett meddelande om inga tillgängliga tider finns */}
      <div className="availabilities-container">
        {availabilities.length === 0 ? (
          <p>No available time slots</p>
        ) : (
          availabilities.map((availability) => (
            <div
              key={availability.id}
              className="availability-item"
              onClick={() => handleAvailabilityClick(availability)}
            >
              <p>{new Date(availability.time).toLocaleString()}</p>{" "}
              {/* Visa formaterad tid */}
            </div>
          ))
        )}
      </div>

      {/* Bokningsbekräftelse-popup */}
      <div className={`book-confirmation ${showConfirmation ? "active" : ""}`}>
        <div className="book-confirmation-dialog">
          <h3>Confirm Booking</h3>
          <p>
            Are you sure you want to book the time:{" "}
            <strong>
              {new Date(selectedAvailability?.time).toLocaleString()}
            </strong>
            ?
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
