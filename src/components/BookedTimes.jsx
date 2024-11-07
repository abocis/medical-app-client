import { useEffect, useState } from "react";
import "./style.css";

export default function BookedTimes() {
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

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>All Booked Times</h2>
      <div>
        {appointments.map((appointment, index) => (
          <div key={index}>
            <p>{appointments}</p>
            <p>{appointment.dateTime}</p>
            <p>{appointment.Status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
