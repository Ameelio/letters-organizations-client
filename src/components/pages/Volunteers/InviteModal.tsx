import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link2 } from 'react-feather';
import CopyToClipboard from 'react-copy-to-clipboard';
import './InviteModal.css';
import { bindActionCreators, Dispatch } from 'redux';
import { inviteVolunteer, loading } from 'src/redux/modules/volunteer';
import { addVolunteer } from '../../../services/Api/volunteers';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../redux';

const SHARE_LINK_URL = 'letters.ameelio.org/register/';

interface InviteModalProps {
  shareLink: string;
  show: boolean;
  handleClose: () => void;
  token: string;
  orgId: number | null;
}
const mapStateToProps = (
  state: RootState,
  inviteModalProps: InviteModalProps,
) => ({
  volunteerState: state.volunteers,
  shareLink: inviteModalProps.shareLink,
  show: inviteModalProps.show,
  handleClose: inviteModalProps.handleClose,
  token: inviteModalProps.token,
  orgId: inviteModalProps.orgId,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      inviteVolunteer,
      loading,
    },
    dispatch,
  );
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

// TODO: API call upon clicking, we probably need to pass the Org object here to retrieve theh share link
const InviteModal: React.FC<PropsFromRedux> = ({
  shareLink,
  show,
  handleClose,
  token,
  orgId,
  volunteerState,
  inviteVolunteer,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onInvite = (
    token: string,
    volunteer: Volunteer,
    volunteerState: VolunteerState,
  ) => {
    inviteVolunteer(token, volunteer, volunteerState);
    handleClose();
  };

  const onSendInvite = (event: React.MouseEvent) => {
    event.preventDefault();
    if (orgId) {
      addVolunteer(token, orgId, searchQuery)
        .then((volunteer) => onInvite(token, volunteer, volunteerState))
        .catch((error) => setErrorMessage(error.message));
    }
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
            isInvalid={errorMessage !== ''}
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form>
        <div className="d-flex flex-column">
          <Button block onClick={onSendInvite}>
            Send invitation
          </Button>

          <div className="d-flex flex-row mt-3">
            <Link2 />
            <span className="ml-3 mr-auto">Share Team Invite Link</span>
            <CopyToClipboard
              text={SHARE_LINK_URL + shareLink}
              onCopy={() => setCopied(true)}>
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

export default connector(InviteModal);
