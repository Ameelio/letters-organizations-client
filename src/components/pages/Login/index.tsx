import React, { useState } from 'react';
import { RootState } from '../../../redux';
import { login } from '../../../services/Api';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import './index.css';

import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedLogin: React.FC<PropsFromRedux> = ({ session }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const onError = (error: Error) => {
    setEmailError(error.toString());
  };

  const tryLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch (error) {
      onError(error.message || error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container id="login-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (session.authInfo.isLoggedIn) {
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
              />
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
