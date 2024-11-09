import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/booking.css";

const BookingPage = () => {
  const [availabilities, setAvailabilities] = useState([]); // Håller koll på tillgängliga tider
  const [loading, setLoading] = useState(true); // Håller koll på om vi hämtar data
  const [error, setError] = useState(null); // För att hantera fel
  const [selectedAvailability, setSelectedAvailability] = useState(null); // För den valda tillgängliga tiden
  const [showConfirmation, setShowConfirmation] = useState(false); // För att visa bokningsbekräftelse
  const [newTime, setNewTime] = useState(""); // För att hantera nya tider som användaren vill lägga till

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

        console.log("Fetched response from backend:", response); // Loggar hela responsen

        // Extrahera tillgängliga tider från servern
        const availableSlots = response.data.flatMap((availability) => {
          return availability.availableSlots.map((slot) => ({
            id: availability.id,
            time: slot,
          }));
        });

        console.log("Filtered availabilities:", availableSlots); // Loggar de filtrerade tillgängliga tiderna
        setAvailabilities(availableSlots); // Uppdatera state med tillgängliga tider
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Error fetching available times.");
      } finally {
        setLoading(false); // Avsluta laddning
      }
    };

    fetchAvailabilities();
  }, []); // Körs endast en gång vid första renderingen

  // Hantera när användaren klickar på en tillgänglig tid
  const handleAvailabilityClick = (availability) => {
    setSelectedAvailability(availability);
    setShowConfirmation(true);
  };

  // Bekräfta bokning
  const handleConfirmBooking = () => {
    alert(`You booked: ${selectedAvailability.time}`);
    setShowConfirmation(false);
  };

  // Avbryt bokning
  const handleCancelBooking = () => {
    setShowConfirmation(false);
  };

  // Lägg till en ny tillgänglig tid i backend
  const addNewTimeSlot = async () => {
    if (!newTime) {
      alert("Please enter a valid time.");
      return;
    }

    const newSlot = new Date(newTime);

    const availabilityDTO = {
      caregiverId: "caregiver-id-here", // Här ska du ange vårdgivarens ID (ändra detta efter behov)
      availableSlots: [newSlot], // Skickar den nya tiden
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/availability",
        availabilityDTO
      );
      console.log("Added new availability:", response);

      // Uppdatera tillgängligheterna i UI:t
      setAvailabilities((prev) => [
        ...prev,
        { id: response.data.id, time: response.data.availableSlots[0] },
      ]);
      setNewTime(""); // Rensa inputfältet
    } catch (error) {
      console.error("Error adding new time slot:", error);
      alert("Error adding new time slot.");
    }
  };

  // Om data är under hämtning, visa en laddningsindikator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Om det finns ett fel vid hämtning, visa felmeddelande
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
              key={availability.id} // Nyckel används för effektiv rendering
              className="availability-item"
              onClick={() => handleAvailabilityClick(availability)} // Hantera klick
            >
              <p>{new Date(availability.time).toLocaleString()}</p>{" "}
              {/* Visa formaterad tid */}
            </div>
          ))
        )}
      </div>

      {/* Lägg till ny tillgänglig tid */}
      <div className="add-time-slot">
        <input
          type="datetime-local"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)} // Hantera förändring i inputfältet
        />
        <button onClick={addNewTimeSlot}>Add New Time Slot</button>
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
