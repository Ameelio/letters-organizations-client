import React, { useState, useEffect } from 'react';
import { RootState } from '../../../redux';

import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import {
  loadOrgContacts,
  addFilter,
  removeFilter,
} from '../../../redux/modules/orgcontacts';
import { loadTags } from '../../../redux/modules/tag';

import TagSelector from '../../tags/TagSelector';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Tag from '../../tags/Tag';
import './index.css';
import Button from 'react-bootstrap/Button';

const mapStateToProps = (state: RootState) => ({
  tags: state.tags.tags,
  orgContacts: state.orgContacts.contacts,
  filters: state.orgContacts.selectedFilters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { loadOrgContacts, addFilter, removeFilter, loadTags },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedContacts: React.FC<PropsFromRedux> = ({
  loadTags,
  tags,
  orgContacts,
  filters,
  loadOrgContacts,
  addFilter,
  removeFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOrgContact, setFilteredOrgContacts] = useState<OrgContact[]>(
    orgContacts,
  );

  useEffect(() => {
    if (orgContacts.length === 0) {
      loadOrgContacts();
    }

    if (tags.length === 0) {
      loadTags();
    }

    let results = orgContacts.filter((contact) =>
      contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (filters.length > 0) {
      results = orgContacts.filter((contact) =>
        contact.tags.some((tag) => filters.includes(tag)),
      );
    }
    setFilteredOrgContacts(results);
  }, [filters, orgContacts, tags, loadOrgContacts, loadTags, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="d-flex flex-row">
      <section className="d-flex flex-column w-25 shadow-sm vh-100 bg-white align-items-center">
        <div className="d-flex flex-column my-5 mx-3 justify-content-center">
          <Form className="mr-3 mb-3 ">
            <FormControl
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
          <span className="black-500 mt-3">Filter by</span>
          <TagSelector
            availableTags={tags.filter((tag) => !filters.includes(tag))}
            selectedTags={filters}
            addTag={addFilter}
            removeTag={removeFilter}
            showTotalCount={false}
          />
        </div>
      </section>

      <section className="d-flex flex-column m-5 w-100">
        <div className="d-flex flex-row justify-content-between">
          <span className="p2 mb-3">Contacts</span>
          <div>
            <Button variant="outline-primary mr-3">Add Contacts</Button>
            <Button variant="outline-secondary">Export as CSV</Button>
          </div>
        </div>

        <div className="vh-100 w-100 shadow-sm p-5 bg-white overflow-auto">
          <Table responsive>
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
              {filteredOrgContact.map((contact) => (
                <tr>
                  <td>{contact.first_name}</td>
                  <td>{contact.first_name}</td>
                  <td>{contact.last_name}</td>
                  <td>{contact.inmate_number}</td>
                  <td>{contact.facility_city}</td>
                  <td>{contact.facility_state}</td>
                  <td className="d-flex flex-column">
                    {contact.tags.map((tag) => (
                      <div className="mb-3">
                        <Tag tag={tag} canRemove={false} showCount={false} />
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
