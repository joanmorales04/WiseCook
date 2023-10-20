import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.min.css";


const NavBar = ({user, handleSignOut}) => {
  return (
    <Navbar className="navbar" sticky="top">
        <Container>
          <Navbar.Brand id="navbar-title" href="#home">WiseCook</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">About</Nav.Link>
            <Nav.Link href="#features">Recipes</Nav.Link>
            <Nav.Link onClick={ (e) => handleSignOut(e)} > Sign Out </Nav.Link>
          </Nav>

          <Nav>
            <Navbar.Text>
              Signed in as: {user.name}
            </Navbar.Text>
          </Nav>
          
          
        </Container>
      </Navbar>
  
  );
};

export default NavBar;