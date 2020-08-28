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
import { logout } from '../../../redux/modules/user';
import Table from 'react-bootstrap/Table';
import './index.css';
import { Link } from 'react-router-dom';
import { Container, Spinner, Button, Col, Row } from 'react-bootstrap';
import { unauthenticated } from 'src/utils/utils';

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags,
  orgContacts: state.orgContacts,
  filters: state.orgContacts.selectedFilters,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { loadOrgContacts, addFilter, removeFilter, loadTags, loading, logout },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const ContactDetails: React.FC<PropsFromRedux> = ({
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
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOrgContact, setFilteredOrgContacts] = useState<OrgContact[]>(
    [],
  );
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);

  const token = user.user.token;
  const org = user.user.org;

  useEffect(() => {
    if (!hasFetchedData && org) {
      loadOrgContacts(token, org.id);
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

  let page_id = 'content';
  if (orgContacts.loading || tags.loading) {
    page_id = 'faded';
  }

  return (
    <Row className="d-flex flex-row">
      <section
        id={page_id}
        className="d-flex flex-row m-5 w-100 bg-white p-5 shadow-sm">
        <Col lg={4} className="d-flex flex-column">
          <Row className="row w-100">
            <Col lg={12} className="d-flex flex-row justify-content-between">
              <Link to="/contacts">&lt; Back to Contacts</Link>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center my-2">
            <img
              className="rounded-img"
              src="https://picsum.photos/seed/picsum/200/200"
            />
          </Row>

          <Row className="justify-content-center my-2">
            <h4>Frankie Peter</h4>
          </Row>

          <Row className="d-flex justify-content-center">
            <Table hover borderless size="sm">
              <tbody>
                <tr>
                  <td className="grey">First Name</td>
                  <td className="grey">Last Name</td>
                </tr>
                <tr>
                  <td>Frankie</td>
                  <td>Peter</td>
                </tr>
                <tr>
                  <td className="grey">Inmate Number</td>
                  <td className="grey">Facility Name</td>
                </tr>
                <tr>
                  <td>269154</td>
                  <td>Englewood Federal Correctional Insitution</td>
                </tr>
              </tbody>
            </Table>
            <div className="w-100 justify-content-center">
              <hr />
            </div>
            <Table hover borderless size="sm">
              <tbody>
                <tr>
                  <td className="grey">City</td>
                  <td className="grey">State</td>
                </tr>
                <tr>
                  <td>Littleton</td>
                  <td>CO</td>
                </tr>
                <tr>
                  <td className="grey">Facility Postal</td>
                  <td className="grey">Facility Address</td>
                </tr>
                <tr>
                  <td>Private Bag 2000 Balclutha 9240</td>
                  <td>62 Narrowdale Rd Milburn Otago 9291</td>
                </tr>
                <tr>
                  <td className="grey">Unit</td>
                  <td className="grey">Dorm</td>
                </tr>
                <tr>
                  <td>---</td>
                  <td>---</td>
                </tr>
              </tbody>
            </Table>
            <Table hover borderless size="sm">
              <tbody>
                <div className="w-100 justify-content-center">
                  <hr />
                </div>
                <tr>
                  <td className="grey"> Notes</td>
                </tr>
                <tr>
                  <td>Notey McNoteFace</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Col>

        <Col lg={1} className="w-10 vh-100">
          <div className="w-100 vh-100 right-line">
            <p>Edit</p>
          </div>
        </Col>
        <Col lg={1} className="w-100 vh-100"></Col>

        <Col lg={6} className="vh-100 d-flex flex-column m-20 p-2">
          <Row className="d-flex flex-row justify-content-end"></Row>
          <Row>
            <Table borderless>
              <thead>
                <tr>
                  <th>Letters sent to Frankie (47)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="border-grey rounded p-2">
                      <p>From: Pen America Sent 4/20</p>
                      <p>2021 writing award newsletter</p>
                    </div>
                  </td>
                  <td>
                    <div className="border-grey rounded p-2">
                      <p>From: Pen America Sent 4/20</p>
                      <p>2021 writing award newsletter</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Col>
      </section>
    </Row>
  );
};

export default connector(ContactDetails);
