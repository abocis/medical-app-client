import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import styled, { keyframes } from "styled-components";
import Logout from "./Logout";

const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 22px;
`;

const AddButton = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  background-color: #057d7a;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  font-weight: bold;
  margin-right: 10px;

  &:hover {
    background-color: #2fadaa;
  }
`;

const BookingButton = styled.button`
  // Styled component for Booking button
  cursor: pointer;
  padding: 10px 20px;
  background-color: #8a2be2;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  font-weight: bold;

  &:hover {
    background-color: #9370db;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 600px;
  height: 600px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormButton = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  background-color: #057d7a;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  font-weight: bold;
  &:hover {
    background-color: #2fadaa;
  }
`;

const SlotList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SlotItem = styled.li`
  margin-bottom: 5px;
  font-size: 16px;
`;

// Toast Notification Animation
const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeInOut} 3s ease forwards;
`;

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    authState: { user, userId },
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
    setToastMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDate("");
    setTime("");
    setAvailableSlots([]);
  };

  const handleAddSlot = () => {
    if (date && time) {
      const dateTime = `${date}T${time}:00`;
      setAvailableSlots((prevSlots) => [...prevSlots, dateTime]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const availabilityData = {
      caregiverId: userId,
      availableSlots,
    };

    try {
      await axios.post("http://localhost:8080/availability", availabilityData, {
        withCredentials: true,
      });
      setToastMessage("Availability added successfully!");
      setTimeout(() => setToastMessage(""), 3000);
      setDate("");
      setTime("");
      setAvailableSlots([]);
      closeModal();
    } catch (error) {
      console.error("Error adding availability:", error);
      setToastMessage("Failed to add availability.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleGoToBooking = () => {
    // Define navigation handler
    navigate("/booking");
  };

  return (
    <AdminContainer>
      <Title>Admin Dashboard</Title>
      <p>Welcome, {user}!</p>
      <Logout />
      <AddButton onClick={openModal}>Add Availability</AddButton>
      <BookingButton onClick={handleGoToBooking}>
        Go to Availabilities
      </BookingButton>{" "}
      {/* New Button */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <h3>Set Availability</h3>
            <form onSubmit={handleSubmit}>
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <br />
              <br />
              <label>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <br />
              <br />
              <FormButton type="button" onClick={handleAddSlot}>
                Add Time
              </FormButton>

              <h4>Available Slots:</h4>
              <SlotList>
                {availableSlots.map((slot, index) => (
                  <SlotItem key={index}>{slot}</SlotItem>
                ))}
              </SlotList>

              <FormButton type="submit">Submit Availability</FormButton>
              <FormButton
                type="button"
                onClick={closeModal}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </FormButton>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </AdminContainer>
  );
}

export default AdminDashboard;
