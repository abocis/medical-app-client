import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import Logout from "./Logout";
import BookedTimes from "./BookedTimes";

// admin page, can only visit if you have role ADMIN
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
  const [appointments, setAppointments] = useState([]);
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);
  // glöm ej plocka in returnen från din BookedTimes.jsx
  // 1. använd axios inte fetch'
  // 2. lägg withCredentials
  // 3. hårdkoda caregiverId först
  // 4. lägg till det jag la till i er main med userId så ska du nog kunna få user id av user
  // 5. döp om till availabilities inte appointments

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
  }, []); // Add caregiverId to dependencies if it changes

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
