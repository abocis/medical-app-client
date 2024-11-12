import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Booking.css";

const BookingPage = ({ initialPatientId, initialCaregiverId }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // State for form inputs
  const [patientId, setPatientId] = useState(initialPatientId || "");
  const [caregiverId, setCaregiverId] = useState(initialCaregiverId || "");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/availability/all",
          {
            withCredentials: true,
          }
        );

        const availableSlots = response.data.flatMap((availability) => {
          return availability.availableSlots.map((slot) => ({
            id: availability.id,
            time: slot,
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

  const handleAvailabilityClick = (availability) => {
    setSelectedAvailability(availability);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAvailability(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skapa bokningsdata
    const appointmentData = {
      patientId: patientId,
      caregiverId: "67277bf847a7116efddefde0",
      dateTime: selectedAvailability.time,
      status: "SCHEDULED",
    };

    try {
      // Skicka POST-förfrågan till backend för att boka tid
      await axios.post("http://localhost:8080/appointments", appointmentData, {
        withCredentials: true,
      });

      setShowModal(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error booking appointment", error);
      setError("An error occurred while booking your appointment.");
    }
  };

  const handleCloseConfirmation = () => {
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
        {availabilities.length === 0 ? (
          <p>No available time slots</p>
        ) : (
          availabilities.map((availability) => (
            <div
              key={`${availability.id}-${new Date(
                availability.time
              ).toISOString()}`}
              className="availability-item"
              onClick={() => handleAvailabilityClick(availability)}
            >
              <p>{new Date(availability.time).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Complete Your Appointment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="patientId">First Name</label>
                <input
                  type="text"
                  Name="patientId"
                  First="patientId"
                  value={""}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="caregiverId">Last Name</label>
                <input
                  type="text"
                  Last="caregiverId"
                  name="caregiverId"
                  value={" "}
                  onChange={(e) => setCaregiverId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointmentTime">Selected Time</label>
                <input
                  type="text"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={new Date(selectedAvailability.time).toLocaleString()}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Booking Confirmed!</h2>
            <p>
              Your appointment has been scheduled for{" "}
              <strong>
                {new Date(selectedAvailability.time).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              .
            </p>
            <button onClick={handleCloseConfirmation}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
