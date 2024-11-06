import styled from "styled-components";
import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background-color: #333;
  border-radius: 9px;
  color: #fff;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 50px;
  margin-right: 25px;
  font-size: 30px
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: #2fadaa;
  }
`;

const Header = () => (
  <HeaderContainer>
    <LogoContainer>
      <LogoImage src={Logo} alt="Health Care Logo" />
      <span>Health Care</span>
    </LogoContainer>
    <NavLinks>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/oss">OSS</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </NavLinks>
  </HeaderContainer>
);

export default Header;
