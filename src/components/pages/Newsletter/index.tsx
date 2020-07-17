import React, { useState, useEffect } from 'react';
import { RootState } from '../../../redux';
import Docdrop from '../../docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadFile,
  updateFileUploadStep,
  addUploadTag,
  removeUploadTag,
  sendNewsletter,
} from '../../../redux/modules/newsletter';
import { loadTags } from '../../../redux/modules/tag';
import ConfirmSendModal from './ConfirmSendModal';
import TagSelector from '../../tags/TagSelector';
import ProgressBarHeader from '../../progress/ProgressBarHeader';
import FunnelButton from '../../buttons/FunnelButton';

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
}) => {
  const [name, setName] = useState<string>('');
  const [newsletter, setNewsletter] = useState<Newsletter>({} as Newsletter);
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  useEffect(() => {
    if (tags.length === 0) {
      loadTags();
    }
    if (uploadStep === 2 && uploadedFile) {
      setNewsletter({
        title: name,
        file: uploadedFile,
        numContacts: 321,
        tags: uploadSelectedTags,
        totalCost: 3213,
      });
      handleModalShow();
    }
  }, [tags, loadTags, uploadStep, name, uploadSelectedTags, uploadedFile]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateFileUploadStep(uploadStep + 1);
  };

  return (
    <div className="upload-file-wrapper">
      <div className="upload-file-container">
        <ProgressBarHeader
          step={uploadStep}
          stepLabels={['Upload file', 'Select contacts', 'Confirm to send']}
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
                onClick={handleNextClick}
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
                availableTags={tags.filter(
                  (tag) => !uploadSelectedTags.includes(tag),
                )}
                selectedTags={uploadSelectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                showTotalCount={true}
              />
            </div>
            <div className="mt-3">
              <Form.Check type="checkbox" label="Select all 7311 contacts" />
            </div>
            <FunnelButton
              onClick={handleNextClick}
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
            sendNewsletter={sendNewsletter}
          />
        )}
      </div>
    </div>
  );
};

export default connector(UnconnectedNewsletter);
