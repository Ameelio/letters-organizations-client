import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ReactComponent as Logo } from '../../assets/logo.svg';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      sticky="top">
      <Navbar.Brand>
        <Link to="/">
          <Logo width="150" />
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
