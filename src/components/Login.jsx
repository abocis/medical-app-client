import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/Booking.css";
// login page
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 80px;
`;

const LoginButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 30px;
  margin-bottom: 20px;
`;

const FormWrapper = styled.form`
  padding: 50px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  gap: 10px;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 0px;

  &:focus {
    outline: none;
  }
`;

function Login() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        credentials,
        {
          withCredentials: true,
          // using withCredentials is crutial for and request that needs to check authorization!
          // so remember to user this if needed
        }
      );

      // HELENA: la till userId här
      const { username, roles, userId } = response.data;

      console.log("LOGIN RESPONSE: " + JSON.stringify(response.data));

      // och här
      setAuthState({
        isAuthenticated: true,
        user: username,
        roles: roles,
        userId: userId,
        loading: false,
      });

      // redirect based on role
      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <LoginContainer>
      <Title>Health Care</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <FormWrapper onSubmit={handleLogin}>
        <label>Username: </label>
        <StyledInput
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <label>Password: </label>
        <StyledInput
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <LoginButton type="submit">Login</LoginButton>
      </FormWrapper>
    </LoginContainer>
  );
}

export default Login;
