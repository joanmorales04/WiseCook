import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

  const NavBar = ({ user, handleSignOut }) => {

    const navigate = useNavigate(); 

    const handleSignOutAndNavigate = () => {
      handleSignOut(); // Call the handleSignOut function from Login.js
      navigate('/login'); // Navigate to the login page
    };
    
    return (
      <Navbar className="navbar" sticky="top">
        <Container>
          <Navbar.Brand id="navbar-title" as={Link} to="/home">
            WiseCook
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/recipes">
              Recipes
            </Nav.Link>
            <Nav.Link onClick={handleSignOutAndNavigate}>Sign Out</Nav.Link>
          </Nav>
          <Nav className="navbar-text">
            <Navbar.Text >Signed in as: {user.user_name} </Navbar.Text>  
            <Navbar.Text> Credits: {user.rate_limiter}</Navbar.Text>          
          </Nav>

        </Container>
      </Navbar>
    );
  };

export default NavBar;