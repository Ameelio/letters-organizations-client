import React from 'react';
import { RootState } from '../../redux';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ReactComponent as Logo } from 'src/assets/logo.svg';
import { connect, ConnectedProps } from 'react-redux';
import { logout } from '../../redux/modules/user';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});
const mapDispatchToProps = {
  logout,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const NavBar: React.FC<PropsFromRedux> = ({ user, logout }) => {
  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  if (user.authInfo.isLoggedIn) {
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
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">
              Volunteers
            </Nav.Link>
            <Nav.Link as={Link} to="/contacts">
              Contacts
            </Nav.Link>
            <Nav.Link as={Link} to="/newsletter">
              Newsletter
            </Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={onLogout}>
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
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
    </Navbar>
  );
};

export default connector(NavBar);
