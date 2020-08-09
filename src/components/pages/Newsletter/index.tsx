import React, { useState, useEffect, useCallback } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as pdfjsLib from 'pdfjs-dist';
import * as PDFObject from 'pdfobject';
import { pdfjsWorker } from 'pdfjs-dist/build/pdf.worker.entry';

import {
  uploadFile,
  updateFileUploadStep,
  addUploadTag,
  removeUploadTag,
  sendNewsletter,
  addAllUploadTags,
  removeAllUploadTags,
  loading,
  removeFile,
} from 'src/redux/modules/newsletter';
import { loadTags } from 'src/redux/modules/tag';
import ConfirmSendModal from './ConfirmSendModal';
import SuccessModal from './SuccessModal';
import TagSelector from 'src/components/tags/TagSelector';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import FunnelButton from 'src/components/buttons/FunnelButton';
import { Container, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  tags: state.tags.tags,
  user: state.user,
  newsletters: state.newsletters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      uploadFile,
      updateFileUploadStep,
      loadTags,
      addUploadTag,
      removeUploadTag,
      sendNewsletter,
      addAllUploadTags,
      removeAllUploadTags,
      loading,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletter: React.FC<PropsFromRedux> = ({
  uploadFile,
  updateFileUploadStep,
  tags,
  loadTags,
  addUploadTag,
  removeUploadTag,
  addAllUploadTags,
  removeAllUploadTags,
  sendNewsletter,
  newsletters,
  user,
}) => {
  const [name, setName] = useState<string>('');
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

  const token = user.user.token;
  const org = user.user.org;

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
        title: name,
        file: newsletters.uploadedFile,
        // numContacts: uploadSelectedTags.reduce(
        //   (prev: number, next: Tag) => prev + next.numContacts,
        //   0,
        // ),
        tags: newsletters.uploadSelectedTags,
      });
      const obj = URL.createObjectURL(newsletters.uploadedFile);
      PDFObject.embed(obj, '#embedded-pdf');
      getPageCount(obj);
      handleModalShow();
    }
  }, [
    removeAllUploadTags,
    hasFetchedTags,
    tags,
    loadTags,
    name,
    newsletters,
    getPageCount,
  ]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateFileUploadStep(newsletters.uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateFileUploadStep(newsletters.uploadStep - 1);
  };

  const handleSelectAllClick = (event: React.MouseEvent) => {
    toggle ? removeAllUploadTags() : addAllUploadTags(tags);
    setToggle(!toggle);
  };

  const handleSubmission = (event: React.MouseEvent) => {
    console.log(pageCount);
    sendNewsletter(token, newsletter, pageCount);
    setShowSuccessModal(true);
    updateFileUploadStep(newsletters.uploadStep + 1);
  };

  const handleDone = (event: React.MouseEvent) => {
    removeFile();
    updateFileUploadStep(0);
  };

  if (
    !user.authInfo.isLoggedIn ||
    newsletters.error.message === 'Expired Token' ||
    newsletters.error.message === 'Unauthorized'
  ) {
    loading();
    return <Redirect to="/login" />;
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
                  value={name}
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
                enabled={newsletters.uploadedFile != null && name !== ''}
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
                tags={tags}
                selectedTags={newsletters.uploadSelectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                // showTotalCount={true}
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
