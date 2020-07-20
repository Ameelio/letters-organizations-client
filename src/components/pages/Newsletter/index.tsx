import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadFile,
  updateFileUploadStep,
  addUploadTag,
  removeUploadTag,
  sendNewsletter,
  addAllUploadTags,
  removeAllUploadTags,
} from 'src/redux/modules/newsletter';
import { loadTags } from 'src/redux/modules/tag';
import ConfirmSendModal from './ConfirmSendModal';
import SuccessModal from './SuccessModal';
import TagSelector from 'src/components/tags/TagSelector';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import FunnelButton from 'src/components/buttons/FunnelButton';

const mapStateToProps = (state: RootState) => ({
  uploadedFile: state.newsletters.uploadedFile,
  uploadStep: state.newsletters.uploadStep,
  tags: state.tags.tags,
  uploadSelectedTags: state.newsletters.uploadSelectedTags,
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
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletter: React.FC<PropsFromRedux> = ({
  uploadFile,
  updateFileUploadStep,
  uploadedFile,
  uploadStep,
  tags,
  loadTags,
  uploadSelectedTags,
  addUploadTag,
  removeUploadTag,
  addAllUploadTags,
  removeAllUploadTags,
  sendNewsletter,
}) => {
  const [name, setName] = useState<string>('');
  const [newsletter, setNewsletter] = useState<DraftNewsletter>(
    {} as DraftNewsletter,
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [hasFetchedTags, setHasFetchedTags] = useState<boolean>(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  useEffect(() => {
    if (!hasFetchedTags) {
      loadTags();
      setHasFetchedTags(true);
    }
    if (uploadStep === 2 && uploadedFile) {
      setNewsletter({
        title: name,
        file: uploadedFile,
        numContacts: uploadSelectedTags.reduce(
          (prev: number, next: Tag) => prev + next.numContacts,
          0,
        ),
        tags: uploadSelectedTags,
      });
      handleModalShow();
    }
    // TODO reset all state values once we're done
  }, [
    removeAllUploadTags,
    hasFetchedTags,
    tags,
    loadTags,
    uploadStep,
    name,
    uploadSelectedTags,
    uploadedFile,
  ]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateFileUploadStep(uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateFileUploadStep(uploadStep - 1);
  };

  const handleSelectAllClick = (event: React.MouseEvent) => {
    toggle ? removeAllUploadTags() : addAllUploadTags(tags);
    setToggle(!toggle);
  };

  const handleSubmission = (event: React.MouseEvent) => {
    // TODO: make this await and catch errors if something goes wrong with newsletter
    sendNewsletter(newsletter);
    setShowSuccessModal(true);
    updateFileUploadStep(uploadStep + 1);
  };

  return (
    <div className="upload-file-wrapper">
      <div className="upload-file-container">
        <ProgressBarHeader
          step={uploadStep}
          stepLabels={[
            'Upload file',
            'Select contacts',
            'Confirm to send',
            'Success',
          ]}
        />

        {uploadStep === 0 && (
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
                  uploadedFile={uploadedFile}
                  acceptedFormat="application/pdf/*"
                  acceptedFormatLabel="PDF"
                />
              </Form.Group>
              <FunnelButton
                onNext={handleNextClick}
                cta="Next"
                enabled={uploadedFile != null && name !== ''}
              />
            </Form>
          </div>
        )}
        {uploadStep === 1 && (
          <div className="mt-5 w-75 d-flex flex-column">
            <span>
              Search and select tags to classify who you want to send your
              newsletter to.
            </span>
            <div>
              <TagSelector
                tags={tags}
                selectedTags={uploadSelectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                showTotalCount={true}
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
              enabled={uploadSelectedTags.length > 0}
            />
          </div>
        )}
        {uploadStep === 2 && (
          <ConfirmSendModal
            handleClose={handleModalClose}
            show={showModal}
            newsletter={newsletter}
            handleSubmission={handleSubmission}
            handleBackClick={handleBackClick}
          />
        )}
        {uploadStep === 3 && <SuccessModal show={showSuccessModal} />}
      </div>
    </div>
  );
};

export default connector(UnconnectedNewsletter);
