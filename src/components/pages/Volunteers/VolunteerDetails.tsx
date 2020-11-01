import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image';
import ContactCard from './ContactCard';
import { Button, Form } from 'react-bootstrap';
import './VolunteerDetails.css';
import { VolunteerActionTypes } from '../../../redux/modules/volunteer';
import AddContactModal from './AddContactModal';

interface VolunteerDetailsProps {
  volunteer: Volunteer;
  page_id: string;
  showUpdateForm: boolean;
  handleUpdateClose: () => void;
  handleUpdateShow: () => void;
  token: string;
  orgId: number;
  updateVolunteer: (
    token: string,
    org_id: number,
    role: string,
    volunteer: Volunteer,
  ) => Promise<Volunteer>;
  selectVolunteer: (token: string, volunteer: Volunteer) => void;
  removeVolunteer: (token: string, volunteer: Volunteer) => Promise<void>;
  loadVolunteers: (token: string, org_id: number, page: number) => void;
  handleError: (error: ErrorResponse) => VolunteerActionTypes;
  user: User;
  page: number;
}

const VolunteerDetails: React.FC<VolunteerDetailsProps> = ({
  volunteer,
  page_id,
  showUpdateForm,
  handleUpdateClose,
  handleUpdateShow,
  token,
  orgId,
  updateVolunteer,
  selectVolunteer,
  removeVolunteer,
  loadVolunteers,
  handleError,
  user,
  page,
}) => {
  const [newRole, setNewRole] = useState<string>(volunteer.role);
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
  const [showAddContactModal, setAddContactModal] = useState<boolean>(false);
  const handleShowAddContact = () => setAddContactModal(true);
  const handleCloseAddContact = () => setAddContactModal(false);
  const handleAddContactClick = (event: React.MouseEvent) => {
    handleShowAddContact();
  };

  useEffect(() => {
    if (!showUpdateForm) {
      setNewRole(volunteer.role);
      setConfirmRemove(false);
    }
  }, [volunteer, showUpdateForm]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRole(event.target.value.toLowerCase());
  };

  const handleRemove = (event: React.MouseEvent) => {
    if (confirmRemove) {
      removeVolunteer(token, volunteer)
        .then(() => loadVolunteers(token, orgId, page))
        .then(() => handleUpdateClose())
        .then(() => setConfirmRemove(false))
        .catch((error) => handleError(error));
    } else {
      setConfirmRemove(true);
    }
  };

  const handleSave = (event: React.MouseEvent) => {
    updateVolunteer(token, orgId, newRole, volunteer)
      .then((volunteer) => selectVolunteer(token, volunteer))
      .catch((error) => handleError(error));
    handleUpdateClose();
  };

  if (showUpdateForm) {
    return (
      <section
        id={page_id}
        className="volunteer-sidebar d-flex flex-column mr-4 bg-white shadow-sm mt-5">
        <Button
          className="cancel-update"
          variant="link"
          onClick={handleUpdateClose}>
          Cancel
        </Button>
        <Button className="update-link" variant="link" onClick={handleSave}>
          Save
        </Button>
        <div className="d-flex flex-column align-items-center pt-5">
          <Image src={volunteer.image} className="large-image" roundedCircle />
          <span className="black-500 font-weight-bold p3 mt-3">
            {volunteer.name}
          </span>
          <Form className="mt-3">
            <Form.Group controlId="select-role">
              <Form.Control
                as="select"
                custom
                onChange={handleRoleChange}
                disabled={user.id === volunteer.user_id}>
                <option selected={volunteer.role === 'member'}>Member</option>
                <option selected={volunteer.role === 'admin'}>Admin</option>
              </Form.Control>
            </Form.Group>
          </Form>
          {confirmRemove && (
            <span className="red p6 confirm-remove">
              Are you sure you want to remove {volunteer.name} from this
              organization?
            </span>
          )}
          <Button
            className="remove-volunteer mb-5"
            variant="outline-danger"
            onClick={handleRemove}
            disabled={user.id === volunteer.user_id}>
            Remove Volunteer
          </Button>
        </div>
      </section>
    );
  } else {
    return (
      <div>
        <section
          id={page_id}
          className="volunteer-sidebar d-flex flex-column mr-4 bg-white shadow-sm mt-5 mb-5">
          <Button
            className="update-link"
            variant="link"
            onClick={handleUpdateShow}>
            Edit
          </Button>
          <div className="d-flex flex-column align-items-center pt-5">
            <Image
              src={volunteer.image}
              className="large-image"
              roundedCircle
            />
            <span className="black-500 font-weight-bold p3 mt-3">
              {volunteer.details?.name}
            </span>
            <span className="black-400">{volunteer.role.toUpperCase()}</span>
            <span className="black-400">{volunteer.details?.email}</span>

            <span className="black-400">
              {volunteer.details?.city}, {volunteer.details?.state}
            </span>
          </div>
          {volunteer.details && (
            <div className="pl-5 pr-5 mb-2">
              <hr />
            </div>
          )}
          {volunteer.details && (
            <div className="d-flex flex-column pl-5 pr-5 pb-5">
              <div className="d-flex flex-row justify-content-between">
                <span className="black-500 font-weight-bold">
                  Contacts ({volunteer.details.contacts.length})
                </span>
                <Button
                  className="btn-sm"
                  variant="outline-primary"
                  onClick={handleAddContactClick}>
                  Add
                </Button>
              </div>
              {volunteer.details.contacts.map((contact, index) => (
                <ContactCard key={index} contact={contact} />
              ))}
            </div>
          )}
        </section>
        {volunteer.details && (
          <AddContactModal
            volunteer={volunteer}
            show={showAddContactModal}
            handleClose={handleCloseAddContact}
            token={token}
            orgId={orgId}
          />
        )}
      </div>
    );
  }
};

export default VolunteerDetails;
