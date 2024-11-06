import React from "react";
import styled from "styled-components";
import Header from "./Header"; // Import the Header component
import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Home = () => (
  <>
    <Header /> 
    <HomeContainer>

      welcome
      
    </HomeContainer>
  </>
);

export default Home;
