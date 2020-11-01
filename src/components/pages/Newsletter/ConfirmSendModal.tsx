import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Illustration } from 'src/assets/mail.svg';
import { track } from 'src/utils/segment';

interface ConfirmSendModalProps {
  show: boolean;
  newsletter: DraftNewsletter;
  handleClose: () => void;
  handleSubmission: (event: React.MouseEvent) => void;
  handleBackClick: (event: React.MouseEvent) => void;
}

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  show,
  newsletter,
  handleClose,
  handleBackClick,
  handleSubmission,
}) => {
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  const onBtnClick = (e: React.MouseEvent) => {
    setHasClicked(true);
    track('Newsletter - Click on Send');
    handleSubmission(e);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div className="blue-600-bg w-100 py-2"></div>
      <Modal.Header>
        <Modal.Title>Send "{newsletter.title}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <Illustration />
          <div className="d-flex flex-row mt-5">
            <Button
              onClick={handleBackClick}
              className="mr-3"
              size="lg"
              variant="outline-secondary">
              Back
            </Button>
            <Button
              className="ml-3"
              size="lg"
              disabled={hasClicked}
              onClick={onBtnClick}>
              Send
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmSendModal;
