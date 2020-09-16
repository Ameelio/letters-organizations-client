import React, { useState } from 'react';
import { RootState } from '../../../redux';
import { loadingUser, login, logout } from '../../../redux/modules/user';
import { onLogin } from '../../../services/Api';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import './index.css';

import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const mapDispatchToProps = { loadingUser, login, logout };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedLogin: React.FC<PropsFromRedux> = ({
  loadingUser,
  login,
  logout,
  user,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onError = (error: Error) => {
    logout();
    setEmailError(error.toString());
  };

  const tryLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    loadingUser();
    onLogin(email, password)
      .then((userData) => login(userData))
      .catch((error) => onError(error));
  };

  if (user.authInfo.isLoadingToken) {
    return (
      <Container id="login-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (user.authInfo.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container id="login-form">
      <Row className="justify-content-lg-center">
        <Col lg={5} className="bg-white p-5 shadow-sm">
          <span className="p2 font-weight-light">Welcome back!</span>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={emailError !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={passwordError !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" block type="submit" onClick={tryLogin}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default connector(UnconnectedLogin);
