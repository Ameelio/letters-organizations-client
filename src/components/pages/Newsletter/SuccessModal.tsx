import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ReactComponent as Illustration } from 'src/assets/skate.svg';
import { Link } from 'react-router-dom';

interface SuccessModalProps {
  show: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show }) => {
  return (
    <Modal show={show}>
      <div className="blue-600-bg w-100 py-2"></div>
      <Modal.Header>
        <Modal.Title>Your newsletter was sent succesfully</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <Illustration />
          <div className="d-flex flex-row mt-5">
            <Link to="/newsletter" className="btn btn-primary">
              Done!
            </Link>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
