import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import styled from "styled-components";
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

  &:hover {
    background-color: #2fadaa;
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
  padding: 20px;
  border-radius: 10px;
  width: 400px;
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

function AdminDashboard() {
  const {
    authState: { user, userId },
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Add a time slot
  const handleAddSlot = () => {
    if (date && time) {
      const dateTime = `${date}T${time}:00`;
      setAvailableSlots((prevSlots) => [...prevSlots, dateTime]);
      setTime("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const availabilityData = {
      caregiverId: userId,
      availableSlots,
    };

    try {
      await axios.post("http://localhost:8080/availability", availabilityData,{

        withCredentials: true,
        
      });
      setMessage("Availability added successfully!");
      setAvailableSlots([]); 
      closeModal();
    } catch (error) {
      console.error("Error adding availability:", error);
      setMessage("Failed to add availability.");
    }
  };

  return (
    <AdminContainer>
      <Title>Admin Dashboard</Title>
      <p>Welcome, {user}!</p>
      <Logout />
      <AddButton onClick={openModal}>Add Availability</AddButton>

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
              <label>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <br />
              <FormButton type="button" onClick={handleAddSlot}>
                Add Slot
              </FormButton>

              <h4>Available Slots:</h4>
              <SlotList>
                {availableSlots.map((slot, index) => (
                  <SlotItem key={index}>{slot}</SlotItem>
                ))}
              </SlotList>

              <FormButton type="submit">Submit Availability</FormButton>
              <FormButton type="button" onClick={closeModal} style={{ marginLeft: "10px" }}>
                Cancel
              </FormButton>
            </form>
            {message && <p>{message}</p>}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
}

export default AdminDashboard;
