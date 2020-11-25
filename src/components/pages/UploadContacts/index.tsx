import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadCsv,
  removeCsv,
  updateCsvUploadStep,
  updateCsvRows,
  addUploadTag,
  removeUploadTag,
  removeAllUploadTags,
  createOrgContacts,
} from 'src/redux/modules/orgcontacts';
import FunnelButton from 'src/components/buttons/FunnelButton';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import Image from 'react-bootstrap/Image';
import Template from 'src/assets/template.png';
import { readString } from 'react-papaparse';
import FieldMappingTable from 'src/components/pages/UploadContacts/FieldMappingTable';
import { initialContactFieldMap } from 'src/data/InitialContactFieldMap';
import TagSelector from 'src/components/tags/TagSelector';
import { loadTags, addNewTag } from 'src/redux/modules/tag';
import ErrorAlert from 'src/components/alerts/ErrorAlert';
import { Clock } from 'react-feather';
import Tag from 'src/components/tags/Tag';
import { Link } from 'react-router-dom';
import { logout } from '../../../redux/modules/user';
import { unauthenticated, validateContactUpload } from 'src/utils/utils';
import Modal from 'src/components/modals/Modal';

const mapStateToProps = (state: RootState) => ({
  uploadedCsv: state.orgContacts.uploadedCsv,
  uploadStep: state.orgContacts.uploadStep,
  tags: state.tags,
  selectedTags: state.orgContacts.uploadSelectedTags,
  error: state.orgContacts.error,
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      uploadCsv,
      updateCsvUploadStep,
      updateCsvRows,
      loadTags,
      addNewTag,
      addUploadTag,
      removeUploadTag,
      removeAllUploadTags,
      removeCsv,
      createOrgContacts,
      logout,
    },
    dispatch,
  );
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedUploadContacts: React.FC<PropsFromRedux> = ({
  uploadCsv,
  removeCsv,
  uploadedCsv,
  uploadStep,
  updateCsvUploadStep,
  updateCsvRows,
  tags,
  loadTags,
  addNewTag,
  addUploadTag,
  removeUploadTag,
  removeAllUploadTags,
  selectedTags,
  createOrgContacts,
  error,
  user,
  logout,
}) => {
  const [mapping, setMapping] = useState<ContactFieldMap>(
    initialContactFieldMap,
  );

  const [feedback, setFeedback] = useState<ErrorFeedback | null>();
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);
  const [errors, setErrors] = useState<InvalidContact[]>();
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const handleNextClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep - 1);
  };

  const token = user.user.token;
  const org = user.user.org;

  const handleSubmission = (event: React.MouseEvent) => {
    const contacts: OrgContact[] = uploadedCsv.data.map((row) => {
      return {
        first_name: row[mapping.firstName.index],
        last_name: row[mapping.lastName.index],
        inmate_number: row[mapping.inmateNumber.index],
        facility_name: row[mapping.facilityName.index],
        facility_state: row[mapping.facilityState.index],
        facility_city: row[mapping.facilityCity.index],
        facility_address: row[mapping.facilityAddress.index],
        facility_postal: row[mapping.facilityPostal.index],
        unit: row[mapping.unit.index],
        dorm: row[mapping.dorm.index],
        relationship: 'Org Contact',
        selected: false,
      } as OrgContact;
    });
    const [validContacts, invalidContacts] = validateContactUpload(contacts);
    if (invalidContacts.length > 0) {
      setErrors(invalidContacts);
      setShowErrorModal(true);
    } else if (org) {
      createOrgContacts(token, org.id, validContacts, selectedTags);
      updateCsvUploadStep(uploadStep + 1);
    }
  };

  const handleDone = (event: React.MouseEvent) => {
    removeCsv();
    removeAllUploadTags();
    updateCsvUploadStep(0);
  };

  useEffect(() => {
    if (!hasFetchedData && org) {
      loadTags(token, org.id);
      setHasFetchedData(true);
    }
  }, [hasFetchedData, loadTags, org, token]);

  let fileReader: FileReader;

  const handFileRead = (e: any) => {
    const content = fileReader.result;

    if (typeof content == 'string') {
      const results = readString(content);

      if (results.data.length < 2) {
        // ensure there are at least two rows of data
        removeCsv();
        setFeedback({
          title: "Oops! There's something wrong with the file!",
          body:
            "It looks like your spreadsheet doesn't have any contacts. Make sure there's at least two rows of data.",
        });
      } else if ((results.data[0] as string[]).length < 8) {
        // ensure that there are the min number of columns needeed
        removeCsv();
        setFeedback({
          title: "Oops! There's something wrong with the file!",
          body:
            "It looks like your spreadsheet doesn't have all the 8 columns that you need to create your contacts. Make sure that you follow the template below.",
        });
      } else {
        setFeedback(null);
        updateCsvRows(results.data as string[][]);
      }
    }
  };

  const handleFileChosen = (file: File) => {
    fileReader = new FileReader();
    fileReader.onloadend = handFileRead;
    fileReader.readAsText(file);
  };

  useEffect(() => {
    if (uploadedCsv.file) {
      handleFileChosen(uploadedCsv.file);
    }
  });

  if (unauthenticated([error.message, tags.error.message])) {
    logout();
  }

  return (
    <div className="upload-file-wrapper">
      {feedback && <ErrorAlert error={feedback} />}
      <div className="upload-file-container">
        <ProgressBarHeader
          step={uploadStep}
          stepLabels={['Upload contacts', 'Map fields', 'Tagging', 'Confirm!']}
        />

        <div className="mt-5 p-5 overflow-auto w-75 d-flex">
          {uploadStep === 0 && (
            <div className="upload-file-step-container ">
              <span>
                Upload a CSV file in this format. Need Help?{' '}
                <a
                  href="https://docs.google.com/spreadsheets/d/1PVDV_hBleSmkeNQ36-U0RUldqWLFyeuz-SufGbNMHHg/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer">
                  Download our CSV template
                </a>
              </span>
              <Image src={Template} className="mb-5" />
              <Docdrop
                uploadFile={uploadCsv}
                uploadedFile={uploadedCsv.file}
                acceptedFormat=".csv"
                acceptedFormatLabel="CSV"
              />
              <div className="ml-auto">
                <FunnelButton
                  cta="Next"
                  onNext={handleNextClick}
                  enabled={uploadedCsv.file !== null}
                />
              </div>
            </div>
          )}

          {uploadStep === 1 && (
            <div className="upload-file-step-container">
              <span>
                Let's make sure that the columns in your uploaded csv map to the
                appropriate fields.
              </span>
              <div className="w-100 shadow-sm p-3 mt-3">
                <FieldMappingTable
                  headers={uploadedCsv.header}
                  sample={uploadedCsv.data[0]}
                  mapping={mapping}
                  setMapping={setMapping}
                />
              </div>
              <FunnelButton
                cta="Next"
                onNext={handleNextClick}
                onBack={handleBackClick}
                enabled={Object.values(mapping).every(
                  (fieldMap) => (fieldMap as FieldMap).index >= 0,
                )}
              />
            </div>
          )}

          {uploadStep === 2 && (
            <div className="upload-file-step-container">
              {showErrorModal && errors && (
                <Modal
                  title={`${errors.length} contacts are incorrectly formatted`}
                  show={true}
                  handleDone={() => setShowErrorModal(false)}
                  buttonCta="Close">
                  <div className="d-flex flex-column">
                    {errors.map((error) => (
                      <div className="d-flex flex-column mt-3">
                        <b>
                          {error.contact.first_name} {error.contact.last_name}
                        </b>{' '}
                        <ul>
                          {error.errors.map((error) => (
                            <li>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Modal>
              )}
              <span>
                Assign existing tags or create new ones for your contacts.
              </span>
              <TagSelector
                tags={tags.tags}
                selectedTags={selectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                showInputField={true}
                token={token}
                orgId={org ? org.id : null}
                addNewTag={addNewTag}
              />
              <FunnelButton
                cta="Create contacts"
                onNext={handleSubmission}
                onBack={handleBackClick}
                enabled={selectedTags.length > 0 && uploadedCsv !== null}
              />
            </div>
          )}
          {uploadStep === 3 && (
            <div className="upload-file-step-container">
              <span className="black-500 p3 mb-3 font-weight-semibold">
                We're adding your contacts!
              </span>
              <Clock size={60} color="#C3DBF5" />
              <span className="mt-3 text-center">
                Depending on the number of contacts you've uploaded, this may
                take several minutes. You can move on to your next tasks in the
                mean time.
              </span>
              <div className="d-flex flex-column mt-5 align-self-start">
                <span className="black-500 p4">You're adding</span>
                <span className="font-weight-bold black-500">
                  {uploadedCsv.data.length} contacts
                </span>
              </div>
              <div className="d-flex flex-column mt-5 align-self-start">
                <span className="black-500 p4">Tags</span>
                <div className="d-flex flex-row mt-2">
                  {selectedTags.map((tag) => (
                    <div className="mb-3 mr-3">
                      <Tag label={tag.label} />
                    </div>
                  ))}
                </div>
              </div>

              <Link to={'/contacts'} onClick={handleDone}>
                Done
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connector(UnconnectedUploadContacts);
