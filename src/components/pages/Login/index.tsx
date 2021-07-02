import React, { useState } from 'react';
import { RootState } from '../../../redux';
import { login } from '../../../services/Api';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import './index.css';

import { Redirect } from 'react-router-dom';
import { isAuthenticated } from 'src/redux/selectors';

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: isAuthenticated(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedLogin: React.FC<PropsFromRedux> = ({ isAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const tryLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setEmailError(error.message || JSON.stringify(error));
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return (
      <Container id="login-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  return (
    <Container className="mt-5 vh-100 w-100">
      <Row className="justify-content-md-center">
        {loading && (
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        {!loading && (
          <Col lg={6} className="bg-white p-5 shadow-sm">
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
        )}
      </Row>
    </Container>
  );
};

export default connector(UnconnectedLogin);
