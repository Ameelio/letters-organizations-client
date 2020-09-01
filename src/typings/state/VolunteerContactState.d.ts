interface VolunteerContactErrors {
  firstNameErr: string;
  lastNameErr: string;
  inmateNumberErr: string;
  facilityNameErr: string;
  facilityAddress1Err: string;
  facilityCityErr: string;
  facilityStateErr: string;
  facilityPostalErr: string;
}

interface VolunteerContactState {
  submitted: boolean;
  uploaded: boolean;
  errorMssg: VolunteerContactErrors;
  contact: VolunteerContact | null;
  failedUpload: boolean;
}
