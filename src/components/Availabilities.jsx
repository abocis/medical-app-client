import React, { useEffect, useState } from "react";
import "../styles/Booking.css";

const Availabilities = () => {
    const [availabilities, setAvailabilities] = useState([]);


    const caregierId = window.localStorage.getItem(userId);

    useEffect(() => {
        if (!caregiverId) return;

        const fetchCaregiverBooking = async () => {
            try {
                console.log("Fetching appointments for caregiver ID:", caregiverId);
                const response = await axios.get(
                    `http://localhost:8080/appointments/caregiver/${caregiverId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                console.log("Fetched appointments:", response.data);
                setAvailabilities(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchCaregiverBooking();
    }, []);

    return (
        <div>
            <h2>Availabilities</h2>
            {availabilities.length > 0 ? (
                <ul>
                    {availabilities.map((availability) => (
                        <li key={availability.id}>
                            {availability.date} - {availability.clientName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No availabilities found.</p>
            )}
        </div>
    );
};

export default Availabilities;
