import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
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
import { calculateNewsletterCost, unauthenticated } from 'src/utils/utils';
import Toggle from './Toggle';
import { track } from 'src/utils/segment';
import { Document, Page, pdfjs } from 'react-pdf';
import './index.css';
import ErrorAlert from 'src/components/alerts/ErrorAlert';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

const LETTER_ASPECT_RATIO = 1.3;

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
  const [isInvalidPDF, setISInvalidPDF] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [hasFetchedTags, setHasFetchedTags] = useState<boolean>(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { token } = session.user;
  const { org } = session.orgUser;

  useEffect(() => {
    if (!hasFetchedTags && org) {
      loadTags(token, org.id);
      setHasFetchedTags(true);
    }
    if (newsletters.uploadStep === 3 && newsletters.uploadedFile) {
      setNewsletter({
        title: newsletters.newsletterName,
        file: newsletters.uploadedFile,
        tags: newsletters.uploadSelectedTags,
        color: newsletters.uploadColor,
        double_sided: newsletters.uploadDoubleSided,
        standardMail: newsletters.standardMail,
      });
      handleModalShow();
    }
  }, [
    removeAllUploadTags,
    hasFetchedTags,
    tags,
    loadTags,
    newsletters,
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
    sendNewsletter(token, newsletter, numPages);
    track('Newsletter - Send Newsletter Success', {
      sheets: numPages / (Number(newsletters.uploadDoubleSided) + 1),
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

  async function onDocumentLoadSuccess(pdf: any): Promise<void> {
    setISInvalidPDF(false);
    setNumPages(pdf.numPages);
    setPageNumber(1);
  }

  async function onPageLoadSuccess(page: any): Promise<void> {
    if (Number((page.height / page.width).toFixed(1)) !== LETTER_ASPECT_RATIO)
      setISInvalidPDF(true);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
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
            'Printing settings',
            'Confirm to send',
            'Success',
          ]}
        />
        {isInvalidPDF && (
          <div className="mt-3">
            <ErrorAlert
              error={{
                title: 'Your PDF dimensions are incorrect.',
                body: 'All PDF pages must be Letter size (8.5 x 11 inches).',
              }}
            />
          </div>
        )}

        {newsletters.uploadStep === 0 && (
          <div className="w-50">
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
              <div className="hidden">
                <Document
                  file={newsletters.uploadedFile}
                  onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(Array(numPages).keys()).map((el, index) => (
                    <Page
                      onLoadSuccess={onPageLoadSuccess}
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                    />
                  ))}
                </Document>
              </div>
              <FunnelButton
                onNext={handleNextClick}
                cta="Next"
                enabled={
                  newsletters.uploadedFile != null &&
                  newsletters.newsletterName !== '' &&
                  !isInvalidPDF
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
            <FunnelButton
              onNext={handleNextClick}
              onBack={handleBackClick}
              cta="Next"
              enabled={
                newsletters.uploadSelectedTags.length > 0 && !isInvalidPDF
              }
            />
          </div>
        )}
        {newsletters.uploadStep === 2 && (
          <div className="d-flex flex-column mt-5">
            <div className="d-flex flex-row">
              <div className="d-flex flex-column p-3 shadow mr-3">
                <Document
                  file={newsletters.uploadedFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="d-flex flex-column align-items-center">
                  <Page pageNumber={pageNumber} width={300} />
                  <div className="page-controls">
                    <button
                      type="button"
                      disabled={pageNumber <= 1}
                      onClick={previousPage}>
                      {'<'}
                    </button>
                    <span>
                      Page {pageNumber || (numPages ? 1 : '--')} of{' '}
                      {numPages || '--'}
                    </span>
                    <button
                      type="button"
                      disabled={pageNumber >= numPages}
                      onClick={nextPage}>
                      {'>'}
                    </button>
                  </div>
                </Document>
              </div>
              <div className="d-flex flex-column ml-5">
                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-column ">
                    <span className="black-400 mb-1">Contacts</span>
                    <span className="font-weight-bold p3">
                      {newsletters.uploadSelectedTags.reduce(
                        (prev, curr) => prev + curr.numContacts,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="d-flex flex-column">
                    <span className="black-400 mb-1">Pages</span>
                    <span className="font-weight-bold p3">{numPages}</span>
                  </div>
                </div>
                <div className="d-flex flex-column mt-3 mw-50">
                  <span className="p5 black-400">Printing</span>
                  <Toggle
                    value={newsletters.uploadDoubleSided}
                    setValue={updateUploadDoublesided}
                    defaultLabel="Single-Sided"
                    otherLabel="Double-Sided"
                  />
                </div>
                <div className="d-flex flex-column mt-3 mw-50">
                  <span className="p5 black-400">Mail Class</span>
                  <Toggle
                    value={newsletters.standardMail}
                    setValue={updateMailClass}
                    defaultLabel="First Class"
                    otherLabel="Standard Mail"
                  />
                </div>
                <div className="d-flex flex-column my-3 mw-50">
                  <span className="p5 black-400">Color</span>
                  <Toggle
                    value={newsletters.uploadColor}
                    setValue={updateUploadColor}
                    defaultLabel="Black and White"
                    otherLabel="Colored"
                  />
                </div>
                <div className="d-flex flex-row justify-content-between my-3 align-items-center">
                  <span className="p5 black-400 mr-1">Unit Cost</span>
                  <span>
                    $
                    {calculateNewsletterCost(
                      newsletters.standardMail,
                      newsletters.uploadColor,
                      numPages,
                      newsletters.uploadDoubleSided
                        ? Math.ceil(numPages / 2)
                        : numPages,
                    )}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-between my-3 align-items-center">
                  <span className="p5 black-400 mr-1">Total</span>
                  <span className="font-weight-bold p3">
                    $
                    {Number(
                      (
                        calculateNewsletterCost(
                          newsletters.standardMail,
                          newsletters.uploadColor,
                          numPages,
                          newsletters.uploadDoubleSided
                            ? Math.ceil(numPages / 2)
                            : numPages,
                        ) *
                        newsletters.uploadSelectedTags.reduce(
                          (prev, curr) => prev + curr.numContacts,
                          0,
                        )
                      ).toFixed(2),
                    )}
                  </span>
                </div>
              </div>
            </div>
            <FunnelButton
              onNext={handleNextClick}
              onBack={handleBackClick}
              cta="Next"
              enabled={
                newsletters.uploadSelectedTags.length > 0 && !isInvalidPDF
              }
            />
          </div>
        )}
        {newsletters.uploadStep === 3 && (
          <ConfirmSendModal
            handleClose={handleModalClose}
            show={showModal}
            newsletter={newsletter}
            handleSubmission={handleSubmission}
            handleBackClick={handleBackClick}
          />
        )}
        {newsletters.uploadStep === 4 && (
          <SuccessModal show={showSuccessModal} handleDone={handleDone} />
        )}
      </div>
    </div>
  );
};

export default connector(UnconnectedNewsletter);
