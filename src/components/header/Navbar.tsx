import React, { FunctionComponent } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar: FunctionComponent = () => {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      sticky="top">
      <Navbar.Brand>
        <Link to="/">
          <img
            src={require('../../assets/logo.svg')}
            width="150px"
            className="d-inline-block align-top"
            alt="Ameelio logo"
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
