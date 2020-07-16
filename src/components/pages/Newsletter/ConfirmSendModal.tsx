import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Illustration } from '../../../assets/mail.svg';
import { AppThunk } from '../../../redux/helpers';
import { sendNewsletter } from '../../../redux/modules/newsletter';

interface ConfirmSendModalProps {
  show: boolean;
  newsletter: Newsletter;
  handleClose: () => void;
  sendNewsletter: (newsletter: Newsletter) => AppThunk;
}

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  newsletter,
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Send newsletter to {newsletter.numContacts} contacts?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <Illustration />
          <div className="d-flex flex-row mt-3">
            <Button className="mr-3" size="lg" variant="outline-secondary">
              Cancel
            </Button>
            <Button
              className="ml-3"
              size="lg"
              onClick={(e) => sendNewsletter(newsletter)}>
              Send
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmSendModal;
