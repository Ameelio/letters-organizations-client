import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapModal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  handleDone: (event: React.MouseEvent) => void;
  title: string;
  image?: JSX.Element;
  buttonCta: string;
  children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({
  show,
  handleDone,
  title,
  image,
  buttonCta,
  children,
}) => {
  return (
    <BootstrapModal show={show}>
      <div className="blue-600-bg w-100 py-2"></div>
      {image}
      <BootstrapModal.Header>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <div className="d-flex flex-column align-items-center">
          {children}
          <div className="d-flex flex-row mt-5">
            <Button onClick={handleDone}>{buttonCta}</Button>
          </div>
        </div>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;
