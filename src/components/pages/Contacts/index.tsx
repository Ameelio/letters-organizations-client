import React, { useState, useEffect, UIEvent } from 'react';
import { RootState } from 'src/redux';
import {
  Table,
  Button,
  Modal,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import Tag from 'src/components/tags/Tag';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import {
  loadOrgContacts,
  addFilter,
  removeFilter,
  loading,
  deleteOrgContacts,
  editContactTags,
  sendDirectMessage,
} from 'src/redux/modules/orgcontacts';
import Docdrop from 'src/components/docdrop/Docdrop';
import { loadTags, addNewTag } from 'src/redux/modules/tag';
import { logout } from '../../../redux/modules/user';
import TagSelector from 'src/components/tags/TagSelector';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import './index.css';
import { Link } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { unauthenticated, isBottom } from 'src/utils/utils';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags,
  orgContacts: state.orgContacts,
  filters: state.orgContacts.selectedFilters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadOrgContacts,
      addFilter,
      removeFilter,
      loadTags,
      loading,
      logout,
      deleteOrgContacts,
      addNewTag,
      editContactTags,
      sendDirectMessage,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedContacts: React.FC<PropsFromRedux> = ({
  loading,
  loadTags,
  tags,
  orgContacts,
  filters,
  loadOrgContacts,
  addFilter,
  removeFilter,
  user,
  logout,
  deleteOrgContacts,
  addNewTag,
  editContactTags,
  sendDirectMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countContacts, setCountContacts] = useState<number>(0);
  const [filteredOrgContact, setFilteredOrgContacts] = useState<OrgContact[]>(
    [],
  );
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [
    contactBeingSentMail,
    setContactBeingSentMail,
  ] = useState<OrgContact | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const { token } = user.user;
  const { org } = user.user;

  useEffect(() => {
    if (!hasFetchedData && org) {
      loadOrgContacts(token, org.id, orgContacts.currPage);
      loadTags(token, org.id);
      setHasFetchedData(true);
    }
    let results = orgContacts.contacts.filter((contact) =>
      `${contact.first_name} ${contact.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

    if (filters.length > 0) {
      results = results.filter((contact) => {
        let passes: boolean = true;
        filters.forEach((t) => {
          if (!contact.tags.some((tag) => tag.id === t.id)) {
            passes = false;
          }
        });
        return passes;
      });
    }
    setFilteredOrgContacts(results);
  }, [
    hasFetchedData,
    filters,
    orgContacts,
    tags,
    loadOrgContacts,
    loadTags,
    searchQuery,
    org,
    token,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (unauthenticated([orgContacts.error.message, tags.error.message])) {
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

  let page_id = 'content';
  if (orgContacts.loading || tags.loading) {
    page_id = 'faded';
  }

  const handleScroll = (e: UIEvent) => {
    const tableDiv = document.getElementById('tableDiv');

    if (tableDiv) {
      if (isBottom(tableDiv) && org) {
        loadOrgContacts(token, org.id, orgContacts.currPage);
      }
    }
  };

  return (
    <div className="d-flex flex-row">
      <section
        id={page_id}
        className="d-flex flex-column w-25 shadow-sm vh-100 bg-white align-items-center">
        <div className="d-flex flex-column my-5 mx-3 justify-content-center">
          <Form className="mr-3 mb-3 ">
            <FormControl
              type="text"
              placeholder="Search name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
          <span className="black-500 mt-3">Filter by</span>
          <TagSelector
            tags={tags.tags}
            selectedTags={filters}
            addTag={addFilter}
            removeTag={removeFilter}
            token={token}
            orgId={org ? org.id : null}
          />
        </div>
      </section>

      <section id={page_id} className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between persist">
          <span className="p2 mb-3">Contacts</span>
          <div>
            <Link to="/upload" className="btn btn-outline-primary">
              Add Contacts
            </Link>
            {/* TODO: Implement export CSV functionality */}
            {/* <Button variant="outline-secondary">Export as CSV</Button> */}
          </div>
        </div>

        {orgContacts.loading && spinner}

        <Modal show={showTagModal}>
          <p className="m-2">
            Select the tags you want to apply to all {countContacts} selected
            contacts. Any other tags currently on these contacts will be
            removed:
          </p>
          <TagSelector
            tags={tags.tags}
            selectedTags={selectedTags}
            addTag={(tag) => {
              setSelectedTags(selectedTags.concat(tag));
            }}
            removeTag={(tag) => {
              setSelectedTags(selectedTags.filter((t) => t !== tag));
            }}
            showInputField={true}
            token={token}
            orgId={org ? org.id : null}
            addNewTag={addNewTag}
          />
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTagModal(false)}>
              Close
            </Button>
            {/* TODO Refactor redux store. This org check should not be necessary. */}
            {org && (
              <Button
                variant="primary"
                onClick={async () => {
                  loading();
                  editContactTags(
                    token,
                    filteredOrgContact.filter((c) => c.selected),
                    selectedTags,
                    org.id,
                  );
                  setShowTagModal(false);
                  setHasFetchedData(false);
                }}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal show={showSuccess}>
          <Modal.Body>
            {!orgContacts.sentDirectLetter ? (
              <h4>Your letter is on it's way!</h4>
            ) : (
              <div>
                <h4>Oh no! There was an error sending your letter:</h4>
                <p>{orgContacts.error.message}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowSuccess(false);
              }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSendModal}>
          <Modal.Body>
            <p>
              {' '}
              Send a message to {contactBeingSentMail?.first_name}{' '}
              {contactBeingSentMail?.last_name}
            </p>
            <Form className="d-flex flex-column">
              <Form.Group controlId="formDocdrop">
                <Form.Label>Attach file</Form.Label>
                <Docdrop
                  uploadFile={(file) => setUploadedFile(file)}
                  uploadedFile={uploadedFile}
                  acceptedFormat="application/pdf/*"
                  acceptedFormatLabel="PDF"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                setShowSendModal(false);
                setContactBeingSentMail(null);
              }}>
              Close
            </Button>
            <Button
              onClick={() => {
                sendDirectMessage(token, {
                  contact_id: contactBeingSentMail
                    ? contactBeingSentMail.id
                    : null,
                  file: uploadedFile,
                });
                setShowSendModal(false);
                setContactBeingSentMail(null);
                setUploadedFile(null);
                setShowSuccess(true);
              }}
              disabled={uploadedFile == null}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>

        <div
          id="tableDiv"
          className="vh-100 w-100 shadow-sm px-2 bg-white overflow-auto tableDiv"
          onScroll={handleScroll}>
          <div className="d-flex flex-row justify-content-between my-3 pt-3 sticky-header">
            <div className="d-flex flex-row justify-content-start">
              <DropdownButton
                title="Key Actions"
                disabled={countContacts === 0}>
                <Dropdown.Item
                  onClick={() => {
                    deleteOrgContacts(
                      token,
                      filteredOrgContact.filter((c) => c.selected),
                    );
                    setHasFetchedData(false);
                    setCountContacts(0);
                  }}>
                  Delete Selected Contacts
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setShowTagModal(true);
                  }}>
                  Edit Tags
                </Dropdown.Item>
              </DropdownButton>
            </div>
            <p className="contactCount"> {countContacts} Contacts Selected </p>
          </div>
          <Table responsive hover>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Inmate ID</th>
                <th>City</th>
                <th>State</th>
                <th>Tags</th>
                <th>Send</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgContact.map((contact, index) => (
                <tr
                  key={index}
                  className={contact.selected ? 'selected_row' : ''}>
                  <td>
                    <Form.Check
                      onChange={() => {
                        setCountContacts(
                          countContacts + (contact.selected ? -1 : 1),
                        );
                        contact.selected = !contact.selected;
                      }}
                      checked={contact.selected}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{contact.first_name}</td>
                  <td>{contact.last_name}</td>
                  <td>{contact.inmate_number}</td>
                  <td>{contact.facility_city}</td>
                  <td>{contact.facility_state}</td>
                  <td className="d-flex flex-column">
                    {contact.tags.map((tag) => (
                      <div className="mb-3" key={tag.label}>
                        <Tag label={tag.label} />
                      </div>
                    ))}
                  </td>
                  <td>
                    <Button
                      title={'send ' + contact.first_name + ' a message'}
                      onClick={() => {
                        setShowSendModal(true);
                        setContactBeingSentMail(contact);
                      }}>
                      <img src={require('./mail.svg')} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default connector(UnconnectedContacts);
