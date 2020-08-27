import { AppThunk } from 'src/redux/helpers';
import { createVolunteerContact } from 'src/services/Api/contacts';

// Action Constants & Shapes
const UPLOAD_SUCCEEDED = 'volunteerContacts/uploadSucceeded';
const INVALID_DETAILS = 'volunteerContacts/invalidDetails';
const UPLOAD_STARTED = 'volunteerContacts/uploadStarted';
const UPLOAD_FAILED = 'volunteerContacts/uploadFailed';

interface UploadSucceededAction {
  type: typeof UPLOAD_SUCCEEDED;
  payload: VolunteerContact;
}

interface InvalidDetailsAction {
  type: typeof INVALID_DETAILS;
  payload: VolunteerContactErrors;
}

interface UploadStarted {
  type: typeof UPLOAD_STARTED;
  payload: VolunteerContact;
}

interface UploadFailed {
  type: typeof UPLOAD_FAILED;
  payload: ErrorResponse;
}

export type VolunteerContactActionTypes =
  | UploadSucceededAction
  | InvalidDetailsAction
  | UploadStarted
  | UploadFailed;

//Action creators
const uploadSucceeded = (
  contact: VolunteerContact,
): VolunteerContactActionTypes => {
  return {
    type: UPLOAD_SUCCEEDED,
    payload: contact,
  };
};

const invalidDetails = (
  details: VolunteerContactErrors,
): VolunteerContactActionTypes => {
  return {
    type: INVALID_DETAILS,
    payload: details,
  };
};

const uploadStarted = (
  contact: VolunteerContact,
): VolunteerContactActionTypes => {
  return {
    type: UPLOAD_STARTED,
    payload: contact,
  };
};

const uploadFailed = (err: ErrorResponse): VolunteerContactActionTypes => {
  return {
    type: UPLOAD_FAILED,
    payload: err,
  };
};

//Reducer
const emptyErrors: VolunteerContactErrors = {
  firstNameErr: '',
  lastNameErr: '',
  inmateNumberErr: '',
  facilityNameErr: '',
  facilityAddress1Err: '',
  facilityCityErr: '',
  facilityStateErr: '',
  facilityPostalErr: '',
};

const initialState: VolunteerContactState = {
  submitted: false,
  uploaded: false,
  errorMssg: emptyErrors,
  contact: null,
  failedUpload: false,
};

export function volunteerContactReducer(
  state = initialState,
  action: VolunteerContactActionTypes,
): VolunteerContactState {
  switch (action.type) {
    case UPLOAD_SUCCEEDED:
      return {
        ...state,
        uploaded: true,
        errorMssg: emptyErrors,
        contact: action.payload,
      };
    case INVALID_DETAILS:
      return {
        ...state,
        errorMssg: action.payload,
      };
    case UPLOAD_STARTED:
      return {
        ...state,
        submitted: true,
        errorMssg: emptyErrors,
        contact: action.payload,
      };
    case UPLOAD_FAILED:
      return {
        ...state,
        submitted: false,
        errorMssg: emptyErrors,
        uploaded: false,
        failedUpload: true,
      };
    default:
      return state;
  }
}

export const submitButton = (
  token: string,
  orgId: number,
  volunteer: Volunteer,
  contact: VolunteerContact,
  resetValues: () => void,
  closeModal: () => void,
): AppThunk => async (dispatch) => {
  var errorMssg: VolunteerContactErrors = JSON.parse(
    JSON.stringify(emptyErrors),
  );
  if (contact.first_name === '') {
    errorMssg.firstNameErr = 'First name is a required field';
  }
  if (contact.last_name === '') {
    errorMssg.lastNameErr = 'Last name is a required field';
  }
  if (contact.inmate_number === '') {
    errorMssg.inmateNumberErr = 'Identification number is a required field';
  }
  if (contact.facility_name === '') {
    errorMssg.facilityNameErr = 'Facility name is a required field';
  }
  if (contact.facility_address === '') {
    errorMssg.facilityAddress1Err = 'Facility address 1 is a required field';
  }
  if (contact.facility_city === '') {
    errorMssg.facilityCityErr = 'Facility city is a required field';
  }
  if (
    contact.facility_postal.length != 5 ||
    !/^\d+$/.test(contact.facility_postal)
  ) {
    errorMssg.facilityPostalErr =
      "Facility postal doesn't look quite right - should be 5 digits.";
  }
  if (contact.facility_postal === '') {
    errorMssg.facilityPostalErr = 'Facility postal is a required field';
  }
  dispatch(invalidDetails(errorMssg));
  const allErrors = Object.values(errorMssg).join('');
  if (allErrors === '') {
    dispatch(uploadStarted(contact));
    createVolunteerContact(token, orgId, volunteer.user_id, contact)
      .then((newContact) => {
        resetValues();
        closeModal();
        dispatch(uploadSucceeded(newContact));
      })
      .catch((error) => dispatch(uploadFailed(error)));
  }
};
