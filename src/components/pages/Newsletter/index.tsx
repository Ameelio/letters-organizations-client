import React, { useState, useEffect, useCallback } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as pdfjsLib from 'pdfjs-dist';
import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';
import { logout } from '../../../redux/modules/user';
import {
  setName,
  uploadFile,
  updateFileUploadStep,
  addUploadTag,
  removeUploadTag,
  sendNewsletter,
  addAllUploadTags,
  removeAllUploadTags,
  loading,
  removeFile,
  updateUploadColor,
  updateUploadDoublesided,
  updateMailClass,
} from 'src/redux/modules/newsletter';
import { loadTags } from 'src/redux/modules/tag';
import ConfirmSendModal from './ConfirmSendModal';
import SuccessModal from './SuccessModal';
import TagSelector from 'src/components/tags/TagSelector';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import FunnelButton from 'src/components/buttons/FunnelButton';
import { Container, Spinner } from 'react-bootstrap';
import { unauthenticated } from 'src/utils/utils';
import Toggle from './Toggle';
import { track } from 'src/utils/segment';

const mapStateToProps = (state: RootState) => ({
  tags: state.tags,
  session: state.session,
  newsletters: state.newsletters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setName,
      uploadFile,
      removeFile,
      updateFileUploadStep,
      loadTags,
      addUploadTag,
      removeUploadTag,
      sendNewsletter,
      addAllUploadTags,
      removeAllUploadTags,
      loading,
      logout,
      updateUploadDoublesided,
      updateUploadColor,
      updateMailClass,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletter: React.FC<PropsFromRedux> = ({
  setName,
  uploadFile,
  removeFile,
  updateFileUploadStep,
  tags,
  loadTags,
  addUploadTag,
  removeUploadTag,
  addAllUploadTags,
  removeAllUploadTags,
  sendNewsletter,
  newsletters,
  session,
  loading,
  logout,
  updateUploadColor,
  updateUploadDoublesided,
  updateMailClass,
}) => {
  const [newsletter, setNewsletter] = useState<DraftNewsletter>(
    {} as DraftNewsletter,
  );
  const [pageCount, setPageCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [hasFetchedTags, setHasFetchedTags] = useState<boolean>(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const { token } = session.user;
  const { org } = session.orgUser;

  const getPageCount = useCallback(async (fileURL: string) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const loadPDF = await pdfjsLib.getDocument(fileURL).promise;
    setPageCount(loadPDF.numPages);
  }, []);

  useEffect(() => {
    if (!hasFetchedTags && org) {
      loadTags(token, org.id);
      setHasFetchedTags(true);
    }
    if (newsletters.uploadStep === 2 && newsletters.uploadedFile) {
      setNewsletter({
        title: newsletters.newsletterName,
        file: newsletters.uploadedFile,
        tags: newsletters.uploadSelectedTags,
        color: newsletters.uploadColor,
        double_sided: newsletters.uploadDoubleSided,
        standardMail: newsletters.standardMail,
      });
      const obj = URL.createObjectURL(newsletters.uploadedFile);
      getPageCount(obj);
      handleModalShow();
    }
  }, [
    removeAllUploadTags,
    hasFetchedTags,
    tags,
    loadTags,
    newsletters,
    getPageCount,
    org,
    token,
  ]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateFileUploadStep(newsletters.uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateFileUploadStep(newsletters.uploadStep - 1);
  };

  const handleSelectAllClick = (event: React.MouseEvent) => {
    toggle ? removeAllUploadTags() : addAllUploadTags(tags.tags);
    setToggle(!toggle);
  };

  const handleSubmission = (event: React.MouseEvent) => {
    sendNewsletter(token, newsletter, pageCount);
    track('Newsletter - Send Newsletter Success', {
      sheets: pageCount / (Number(newsletters.uploadDoubleSided) + 1),
      type: newsletters.standardMail ? 'Standard' : 'First Class',
      color: newsletters.uploadColor ? 'Color' : 'Black and White',
    });
    setShowSuccessModal(true);
    updateFileUploadStep(newsletters.uploadStep + 1);
  };

  const handleDone = (event: React.MouseEvent) => {
    removeFile();
    removeAllUploadTags();
    updateFileUploadStep(0);
  };

  if (unauthenticated([newsletters.error.message, tags.error.message])) {
    loading();
    logout();
  }

  const spinner = (
    <Container id="contacts-spinner">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );

  if (newsletters.loading) {
    return spinner;
  }

  return (
    <div className="upload-file-wrapper">
      <div className="upload-file-container">
        <ProgressBarHeader
          step={newsletters.uploadStep}
          stepLabels={[
            'Upload file',
            'Select contacts',
            'Confirm to send',
            'Success',
          ]}
        />

        {newsletters.uploadStep === 0 && (
          <div>
            <div className="d-flex flex-column align-items-center mt-3">
              <span className="p2 black-500 mt-3">Newsletters</span>
              <span className="black-500">
                Send newsletters to a specific group of contact
              </span>
            </div>
            <Form className="mt-5 d-flex flex-column">
              <Form.Group controlId="formName" className="mt-3">
                <Form.Label>Name your newsletter</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  value={newsletters.newsletterName}
                  type="text"
                  placeholder="Untitled"
                />
              </Form.Group>
              <Form.Group controlId="formDocdrop">
                <Form.Label>Attach file</Form.Label>
                <Docdrop
                  uploadFile={uploadFile}
                  uploadedFile={newsletters.uploadedFile}
                  acceptedFormat="application/pdf/*"
                  acceptedFormatLabel="PDF"
                />
              </Form.Group>
              <FunnelButton
                onNext={handleNextClick}
                cta="Next"
                enabled={
                  newsletters.uploadedFile != null &&
                  newsletters.newsletterName !== ''
                }
              />
            </Form>
          </div>
        )}
        {newsletters.uploadStep === 1 && (
          <div className="mt-5 w-75 d-flex flex-column">
            <span>
              Search and select tags to classify who you want to send your
              newsletter to.
            </span>
            <div>
              <TagSelector
                tags={tags.tags}
                selectedTags={newsletters.uploadSelectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                token={token}
                orgId={org ? org.id : null}
              />
            </div>
            <div className="mt-3">
              <Form.Check
                onClick={handleSelectAllClick}
                type="checkbox"
                label="Select all contacts"
              />
            </div>
            <div className="d-flex flex-column mt-3 mw-50">
              <span className="p5 font-weight-bold">Printing</span>
              <Toggle
                value={newsletters.uploadDoubleSided}
                setValue={updateUploadDoublesided}
                defaultLabel="Single-Sided"
                otherLabel="Double-Sided"
              />
            </div>
            <div className="d-flex flex-column mt-3 mw-50">
              <span className="p5 font-weight-bold">Mail Class</span>
              <Toggle
                value={newsletters.standardMail}
                setValue={updateMailClass}
                defaultLabel="First Class"
                otherLabel="Standard Mail"
              />
            </div>
            <div className="d-flex flex-column my-3 mw-50">
              <span className="p5 font-weight-bold">Color</span>
              <Toggle
                value={newsletters.uploadColor}
                setValue={updateUploadColor}
                defaultLabel="Black and White"
                otherLabel="Colored"
              />
            </div>
            <FunnelButton
              onNext={handleNextClick}
              onBack={handleBackClick}
              cta="Next"
              enabled={newsletters.uploadSelectedTags.length > 0}
            />
          </div>
        )}
        {newsletters.uploadStep === 2 && (
          <ConfirmSendModal
            handleClose={handleModalClose}
            show={showModal}
            newsletter={newsletter}
            handleSubmission={handleSubmission}
            handleBackClick={handleBackClick}
          />
        )}
        {newsletters.uploadStep === 3 && (
          <SuccessModal show={showSuccessModal} handleDone={handleDone} />
        )}
      </div>
    </div>
  );
};

export default connector(UnconnectedNewsletter);
