import React, { useState, useEffect } from 'react';
import { RootState } from '../../../redux';
import Docdrop from './Docdrop';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import './Docdrop.css';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadFile,
  updateFileUploadStep,
  addUploadTag,
  removeUploadTag,
  sendNewsletter,
} from '../../../redux/modules/newsletter';
import Button from 'react-bootstrap/Button';
import './index.css';
import { loadTags } from '../../../redux/modules/tag';
import ConfirmSendModal from './ConfirmSendModal';
import TagSelector from '../../tags/TagSelector';

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
  }, [tags, loadTags, uploadStep]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateFileUploadStep(uploadStep + 1);
  };

  const docdropBtn: JSX.Element =
    uploadedFile && name ? (
      <Button size="lg" className="ml-auto mt-3" onClick={handleNextClick}>
        Next &#62;
      </Button>
    ) : (
      <Button size="lg" className="ml-auto mt-3" disabled>
        Next &#62;
      </Button>
    );

  const tagSelectorBtn: JSX.Element =
    uploadSelectedTags.length > 0 ? (
      <Button size="lg" className="ml-auto mt-3" onClick={handleNextClick}>
        Next &#62;
      </Button>
    ) : (
      <Button size="lg" className="ml-auto mt-3" disabled>
        Next &#62;
      </Button>
    );

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      <div className="newsletter-container d-flex flex-column bg-white w-75 mt-5 align-items-center pb-5">
        <div className="w-100">
          <ProgressBar now={(uploadStep + 1) * 33} />
          <div className="d-flex flex-row justify-content-around mt-2">
            <span className="font-weight-bold primary">Upload file</span>
            <span
              className={
                uploadStep > 0 ? 'font-weight-bold primary' : 'black-300'
              }>
              Select contacts
            </span>
            <span
              className={
                uploadStep > 1 ? 'font-weight-bold primary' : 'black-300'
              }>
              Confirm to send
            </span>
          </div>
        </div>

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
                <Docdrop uploadFile={uploadFile} uploadedFile={uploadedFile} />
              </Form.Group>
              {docdropBtn}
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
            {tagSelectorBtn}
          </div>
        )}
        {/* {uploadStep == 2 && (
            <div>

            </div>
        )} */}
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
