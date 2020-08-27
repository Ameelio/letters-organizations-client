import React, { useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { submitButton } from 'src/redux/modules/volunteerContacts';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux';

interface AddContactModalProps {
  volunteer: Volunteer;
  show: boolean;
  handleClose: () => void;
  token: string;
  orgId: number;
}
const mapStateToProps = (
  state: RootState,
  addContactModalProps: AddContactModalProps,
) => ({
  vcState: state.volunteerContacts,
  volunteer: addContactModalProps.volunteer,
  show: addContactModalProps.show,
  handleClose: addContactModalProps.handleClose,
  token: addContactModalProps.token,
  orgId: addContactModalProps.orgId,
  errors: state.volunteerContacts.errorMssg,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      submitButton,
    },
    dispatch,
  );
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const AddContactModal: React.FC<PropsFromRedux> = ({
  vcState,
  volunteer,
  show,
  handleClose,
  token,
  orgId,
  errors,
  submitButton,
}) => {
  const STATES = [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'VI',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [inmateNumber, setInmateNumber] = useState<string>('');
  const [facilityName, setFacilityName] = useState<string>('');
  const [facilityAddress1, setFacilityAddress1] = useState<string>('');
  const [facilityAddress2, setFacilityAddress2] = useState<string>('');
  const [facilityCity, setFacilityCity] = useState<string>('');
  const [facilityState, setFacilityState] = useState<string>(STATES[0]);
  const [facilityPostal, setFacilityPostal] = useState<string>('');
  const [facilityPhone, setFacilityPhone] = useState<string>('');
  const [facilityDorm, setFacilityDorm] = useState<string>('');
  const [facilityUnit, setFacilityUnit] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('Other');

  const handleInputChange = (
    set: React.Dispatch<React.SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    set(event.target.value);
  };

  const handleRelationshipChange = (
    set: React.Dispatch<React.SetStateAction<string>>,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    set(event.target.value);
  };

  const resetValues = () => {
    [
      setFirstName,
      setMiddleName,
      setLastName,
      setInmateNumber,
      setFacilityName,
      setFacilityAddress1,
      setFacilityAddress2,
      setFacilityCity,
      setFacilityPostal,
      setFacilityPhone,
      setFacilityDorm,
      setFacilityDorm,
      setFacilityUnit,
    ].forEach((func) => {
      func('');
    });
    setFacilityState(STATES[0]);
    setRelationship('Other');
    vcState.failedUpload = false;
  };

  const handleCancel = () => {
    resetValues();
    handleClose();
  };

  const handleSubmit = () => {
    const contact: VolunteerContact = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      inmate_number: inmateNumber,
      facility_name: facilityName,
      facility_address: facilityAddress1,
      facility_city: facilityCity,
      facility_state: facilityState,
      facility_postal: facilityPostal,
      dorm: facilityDorm,
      unit: facilityUnit,
      org_id: orgId,
      total_letters_sent: 0,
      profile_img_path: 'avatar.svg',
      last_letter_sent: null,
      relationship: relationship,
    };
    submitButton(token, orgId, volunteer, contact, resetValues, handleClose);
  };

  return (
    <Modal show={show} onHide={handleCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create contact for {volunteer.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className={'mb-3 ' + (vcState.failedUpload ? 'hidden' : '')}>
          <Form.Row className="mb-3">
            <Col xs={4}>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFirstName, e)
                }
                isInvalid={errors.firstNameErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstNameErr}
              </Form.Control.Feedback>
            </Col>
            <Col xs={4}>
              <Form.Control
                type="text"
                placeholder="Middle Name"
                value={middleName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setMiddleName, e)
                }
              />
            </Col>
            <Col xs={4}>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setLastName, e)
                }
                isInvalid={errors.lastNameErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastNameErr}
              </Form.Control.Feedback>
            </Col>
          </Form.Row>
          <Form.Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Identification Number"
                value={inmateNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setInmateNumber, e)
                }
                isInvalid={errors.inmateNumberErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.inmateNumberErr}
              </Form.Control.Feedback>
            </Col>
          </Form.Row>
          <Form.Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Facility Name"
                value={facilityName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityName, e)
                }
                isInvalid={errors.facilityNameErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.facilityNameErr}
              </Form.Control.Feedback>
            </Col>
          </Form.Row>
          <Form.Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Facility Address Line 1"
                value={facilityAddress1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityAddress1, e)
                }
                isInvalid={errors.facilityAddress1Err !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.facilityAddress1Err}
              </Form.Control.Feedback>
            </Col>
          </Form.Row>

          <Form.Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Facility Address Line 2"
                value={facilityAddress2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityAddress2, e)
                }
              />
            </Col>
          </Form.Row>

          <Form.Row className="mb-3">
            <Col xs={7}>
              <Form.Control
                type="text"
                placeholder="Facility City"
                value={facilityCity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityCity, e)
                }
                isInvalid={errors.facilityCityErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.facilityCityErr}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Group controlId="selectState">
                <Form.Control
                  as="select"
                  custom
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleRelationshipChange(setFacilityState, e)
                  }
                  defaultValue={facilityState}>
                  {STATES.map((state) => (
                    <option value={state}>{state}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Facility Postal"
                value={facilityPostal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityPostal, e)
                }
                isInvalid={errors.facilityPostalErr !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {errors.facilityPostalErr}
              </Form.Control.Feedback>
            </Col>
          </Form.Row>

          <Form.Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Facility Phone"
                value={facilityPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityPhone, e)
                }
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Dorm"
                value={facilityDorm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityDorm, e)
                }
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Unit"
                value={facilityUnit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(setFacilityUnit, e)
                }
              />
            </Col>
            <Col>
              <Form.Group controlId="selectRelationship">
                <Form.Control
                  as="select"
                  custom
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleRelationshipChange(setRelationship, e)
                  }
                  defaultValue={relationship}>
                  {/* TODO: Get full list of options */}
                  <option value="Client">Client</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>
        <div className={vcState.failedUpload ? '' : 'hidden'}>
          <h4>Oof - we're sorry. Having some trouble with our server.</h4>
          <p>
            {' '}
            Shoot a message over to the Ameelio team and we'll take care of this
            as soon as we can.{' '}
          </p>
        </div>
        <hr />
        <div className="d-flex flex-row justify-content-md-end mb-3">
          <Button variant="outline-primary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" className="ml-2" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default connector(AddContactModal);
