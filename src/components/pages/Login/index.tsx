import React, { useState } from 'react';
import { login } from '../../../redux/modules/user';
import { RootState } from '../../../redux';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  username: state.user.username,
});

const mapDispatchToProps = { login };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedLogin: React.FC<PropsFromRedux> = ({ login, username }) => {
  const [inputName, setInputName] = useState('');

  const tryLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    login(inputName);
  };

  if (username !== null) {
    return <Redirect to="/" />;
  }

  return (
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" block type="submit" onClick={tryLogin}>
        Login
      </Button>
    </Form>
  );
};

export default connector(UnconnectedLogin);
