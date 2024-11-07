import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import Logout from "./Logout";

// Styling för komponenterna
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

const Button = styled.button`
  padding: 10px 30px;
  background-color: #057d7a;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2fadaa;
  }
`;

function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const navigate = useNavigate(); // Skapa en navigate-funktion

  const handleGoToBooking = () => {
    navigate("/booking"); // Navigera till bokningssidan
  };

  return (
    <AdminContainer>
      <LogoContainer src={Logo} />
      <Title>Admin Dashboard</Title>
      <Text>Welcome, {user}!</Text>
      <Button onClick={handleGoToBooking}>Go to Booking</Button>
      <Logout />
    </AdminContainer>
  );
}

export default AdminDashboard;
