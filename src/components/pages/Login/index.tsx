import React, { useState } from 'react';
import { login } from '../../../redux/modules/user';
import { onLogin } from '../../../services/Api';
import { RootState } from '../../../redux';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './index.css';

import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const mapDispatchToProps = { login };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedLogin: React.FC<PropsFromRedux> = ({ login, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onError = (error: Object) => {
    if ('email' in error) {
      setEmailError(error['email'][0]);
    }
    if ('password' in error) {
      setPasswordError(error['password'][0]);
    }
  };

  const tryLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    onLogin(email, password)
      .then((userData) => login(userData))
      .catch((error) => onError(error));
  };

  if (user.authInfo.isLoggedIn === true) {
    return <Redirect to="/volunteers" />;
  }

  return (
    <Container id="loginForm">
      <Row className="justify-content-lg-center">
        <Col lg={5}>
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
