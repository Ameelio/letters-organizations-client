import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link2 } from 'react-feather';
import CopyToClipboard from 'react-copy-to-clipboard';
import './InviteModal.css';

interface InviteModalProps {
  shareLink: string;
  show: boolean;
  handleClose: () => void;
}

// TODO: API call upon clicking, we probably need to pass the Org object here to retrieve theh share link
const InviteModal: React.FC<InviteModalProps> = ({
  shareLink,
  show,
  handleClose,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Invite to Organization</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mb-3">
          <FormControl
            type="text"
            placeholder="Add people by email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form>
        <div className="d-flex flex-column">
          <Button block>Send invitation</Button>

          <div className="d-flex flex-row mt-3">
            <Link2 />
            <span className="ml-3 mr-auto">Share Team Invite Link</span>
            <CopyToClipboard text={shareLink} onCopy={() => setCopied(true)}>
              <span className="primary copy-share-link">Copy link</span>
            </CopyToClipboard>
          </div>
          <span className="p6">
            Anyone with the link can join as an organization volunteer
          </span>
          {copied && <span className="mt-3 p6">Copied to clipboard.</span>}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InviteModal;
