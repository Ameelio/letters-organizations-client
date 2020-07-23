import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
interface LetterModalProps {
  letter: Letter;
  show: boolean;
  handleClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({
  letter,
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{letter.contact_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <span>{letter.content}</span>
          {letter.images.map((image_url) => (
            <Image src={image_url} className="large-image mt-3" />
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LetterModal;
