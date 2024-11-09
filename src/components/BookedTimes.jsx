import { useEffect, useState } from "react";

export default function BookedTimes({ caregiverId }) {
  const [appointments, setAppointments] = useState([]);

  // useEffect to fetch all appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      const url = `${
        import.meta.env.VITE_API_URL
      }/appointments/caregiver${caregiverId}`;
      console.log("Fetching URL: ", url);

      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("DATA: ", data);
          setAppointments(data);
        } else {
          console.error("Error fetching data: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (caregiverId) {
      fetchAppointments();
    }
  }, [caregiverId]); // Add caregiverId to dependencies if it changes

  return (
    <div>
      <h2>All Booked Times</h2>
      <div>
        {appointments.map((appointment, index) => (
          <div key={index}>
            <p>Date and Time: {appointment.dateTime}</p>
            <p>Status: {appointment.Status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
