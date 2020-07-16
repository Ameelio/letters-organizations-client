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
} from '../../../redux/modules/newsletter';
import Button from 'react-bootstrap/Button';
import './index.css';
import { loadTags } from '../../../redux/modules/tag';
import Badge from 'react-bootstrap/Badge';
import { tagColors } from '../../../data/TagColors';
import { hashCode } from '../../../utils/utils';

const mapStateToProps = (state: RootState) => ({
  uploadedFile: state.newsletters.uploadedFile,
  uploadStep: state.newsletters.uploadStep,
  tags: state.tags.tags,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ uploadFile, updateFileUploadStep, loadTags }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedNewsletter: React.FC<PropsFromRedux> = ({
  uploadFile,
  updateFileUploadStep,
  uploadedFile,
  uploadStep,
  tags,
  loadTags,
}) => {
  const [name, setName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    console.log(tags);
    if (tags.length === 0) {
      loadTags();
    }
  }, [uploadFile, updateFileUploadStep, uploadedFile, uploadStep, tags]);

  const handleNextClick = (event: React.MouseEvent, step: UploadStep) => {
    updateFileUploadStep(step);
  };

  const handleTagClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Tag,
  ) => {
    selectedTags.push(tag);
    setSelectedTags(tags);
  };

  const docdropBtn: JSX.Element =
    uploadedFile && name ? (
      <Button size="sm" className="ml-auto mt-3">
        Next &#62;
      </Button>
    ) : (
      <Button
        onClick={(e) => handleNextClick(e, 1)}
        size="sm"
        className="ml-auto mt-3"
        disabled>
        Next &#62;
      </Button>
    );
  console.log(uploadStep);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      <div className="newsletter-container d-flex flex-column bg-white w-50 mt-5 align-items-center pb-5">
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

        {uploadStep == 0 && (
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
        {uploadStep == 1 && (
          <div className="mt-5">
            <span>
              Search and select tags to classify who you want to send your
              newsletter to.
            </span>
            <div>
              <div className="black-200-bg w-100 py-4 d-flex-flex-row">
                {selectedTags.map((tag) => (
                  <div
                    className="mb-3"
                    key={tag.label}
                    onClick={(e) => handleTagClick(e, tag)}>
                    <span
                      className={`p-1 rounded ${
                        tagColors[hashCode(tag.label) % (tagColors.length - 1)]
                      }`}>
                      {tag.label} ({tag.numContacts})
                    </span>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-column shadow-sm bg-white p-3">
                {tags.map((tag) => (
                  <div
                    className="mb-3"
                    key={tag.label}
                    onClick={(e) => handleTagClick(e, tag)}>
                    <span
                      className={`p-1 rounded ${
                        tagColors[hashCode(tag.label) % (tagColors.length - 1)]
                      }`}>
                      {tag.label} ({tag.numContacts})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(UnconnectedNewsletter);
