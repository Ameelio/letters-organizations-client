import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';

import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import {
  loadOrgContacts,
  addFilter,
  removeFilter,
  loading,
} from 'src/redux/modules/orgcontacts';
import { loadTags } from 'src/redux/modules/tag';

import TagSelector from 'src/components/tags/TagSelector';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Tag from 'src/components/tags/Tag';
import './index.css';
import { Link, Redirect } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags.tags,
  orgContacts: state.orgContacts,
  filters: state.orgContacts.selectedFilters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { loadOrgContacts, addFilter, removeFilter, loadTags, loading },
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
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOrgContact, setFilteredOrgContacts] = useState<OrgContact[]>(
    [],
  );
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);

  const token = user.user.token;
  const org = user.user.org;

  useEffect(() => {
    if (!hasFetchedData && orgContacts.contacts.length === 0 && org) {
      loadOrgContacts(token, org.id);
      loadTags();
      setHasFetchedData(true);
    }

    let results = orgContacts.contacts.filter((contact) =>
      `${contact.first_name} ${contact.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

    if (filters.length > 0) {
      results = results.filter((contact) =>
        contact.tags.some((tag) => filters.includes(tag)),
      );
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
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (
    !user.authInfo.isLoggedIn ||
    orgContacts.error.message === 'Expired Token'
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

  let page_id = 'content';
  if (orgContacts.loading) {
    page_id = 'faded';
  }

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
            tags={tags}
            selectedTags={filters}
            addTag={addFilter}
            removeTag={removeFilter}
            showTotalCount={false}
          />
        </div>
      </section>

      <section id={page_id} className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between">
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

        <div className="vh-100 w-100 shadow-sm p-5 bg-white overflow-auto">
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Inmate ID</th>
                <th>City</th>
                <th>State</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgContact.map((contact, index) => (
                <tr key={index}>
                  <td>{contact.first_name}</td>
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
