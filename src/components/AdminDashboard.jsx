import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";

const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LogoContainer = styled.img`
  height: 20rem;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const Text = styled.p`
  font-size: 18px;
`;

function AdminDashboard() {
  const [availabilities, setAvailabilities] = useState([]);
  const {
    authState: { user },
  } = useAuth();

  // Hårdkodat id
  const caregiverId = "67277bf847a7116efddefde0";

  // glöm ej plocka in returnen från din BookedTimes.jsx
  // 1. använd axios inte fetch'
  // 2. lägg withCredentials
  // 3. hårdkoda caregiverId först
  // 4. lägg till det jag la till i er main med userId så ska du nog kunna få user id av user
  // 5. döp om till availabilities inte appointments

  useEffect(() => {
    const fetchAvailabilities = async () => {
      const url = `${
        import.meta.env.VITE_API_URL
      }/appointments/caregiver/${caregiverId}`;
      console.log("Fetching URL: ", url);

      try {
        const response = await axios.get(url, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const data = response.data;
          console.log("DATA: ", JSON.stringify(data));
          setAvailabilities(data);
        } else {
          console.error("Error fetching data: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (caregiverId) {
      fetchAvailabilities();
    }
  }, []);

  return (
    <AdminContainer>
      <LogoContainer src={Logo} alt="Health Care Logo" />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user?.name || "Admin"}!</Text> <Logout />
      <h2>All Booked Times</h2>
      <div>
        {availabilities.length > 0 ? (
          availabilities.map((availability, index) => (
            <div key={index}>
              <p>Date and Time: {availability.dateTime}</p>
              <p>Status: {availability.status}</p>
              <p>Patient {availability.patientId}</p>
            </div>
          ))
        ) : (
          <p>No availabilities booked yet.</p>
        )}
      </div>
    </AdminContainer>
  );
}

export default AdminDashboard;
