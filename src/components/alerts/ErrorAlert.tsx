import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface Props {
  error: ErrorFeedback;
}
const ErrorAlert: React.FC<Props> = ({ error }) => {
  return (
    <Alert variant="danger">
      <Alert.Heading>{error.title}</Alert.Heading>
      <span>{error.body}</span>
    </Alert>
  );
};

export default ErrorAlert;
