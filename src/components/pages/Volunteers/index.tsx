import React, { useState, useEffect } from 'react';
import VolunteerCard from './VolunteerCard';
import LetterCard from './LetterCard';
import Image from 'react-bootstrap/Image';
import ContactCard from './ContactCard';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import './index.css';
import LetterModal from './LetterModal';
import InviteModal from './InviteModal';
import { RootState } from '../../../redux';
import store from '../../../../src';
import { bindActionCreators, Dispatch } from 'redux';
import { loadVolunteers, selectVolunteer } from 'src/redux/modules/volunteer';
import { connect, ConnectedProps } from 'react-redux';
import { Container, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  volunteers: state.volunteers.all_volunteers,
  selectedVolunteer: state.volunteers.selected_volunteer,
  loading: state.volunteers.loading,
  loadingDetails: state.volunteers.loading_details,
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadVolunteers,
      selectVolunteer,
    },
    dispatch,
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

// TODO move each section to its own container
const UnconnectedVolunteers: React.FC<PropsFromRedux> = ({
  loadVolunteers,
  volunteers,
  selectVolunteer,
  selectedVolunteer,
  loading,
  loadingDetails,
  user,
}) => {
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(
    volunteers,
  );

  const token = store.getState().user.user.token;
  const org = store.getState().user.user.org;

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [hasFetchedVolunteers, setHasFetchedVolunteers] = useState<boolean>(
    false,
  );

  const handleLetterClose = () => setShowLetterModal(false);
  const handleLetterShow = () => setShowLetterModal(true);

  const handleInviteClose = () => setShowInviteModal(false);
  const handleInviteShow = () => setShowInviteModal(true);

  const handleVolunteerClick = (
    event: React.MouseEvent,
    volunteer: Volunteer,
  ) => {
    selectVolunteer(token, volunteer);
  };

  const handleLetterClick = (event: React.MouseEvent, letter: Letter) => {
    setSelectedLetter(letter);
    handleLetterShow();
  };

  const handleInviteClick = (event: React.MouseEvent) => {
    handleInviteShow();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (volunteers.length === 0 && org) {
      loadVolunteers(token, org.id);
      setHasFetchedVolunteers(true);
    }

    const results = volunteers.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredVolunteers(results);
  }, [hasFetchedVolunteers, loadVolunteers, volunteers, searchQuery]);

  if (!user.authInfo.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const spinner = (
    <Container id="volunteers-spinner">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );

  if (loading) {
    return spinner;
  }

  let page_id = 'content';
  if (loadingDetails) {
    page_id = 'faded';
  }

  return (
    <div className="d-flex flex-row">
      <section
        id={page_id}
        className="volunteers-list-sidebar d-flex flex-column mw-27 border-right pl-4 shadow-sm bg-white rounded">
        <div className="d-flex flex-row justify-content-between align-items-center mt-5 mb-3 mr-3 ">
          <span className="black-500 p3">Volunteers</span>
          <Button onClick={handleInviteClick}>Invite</Button>
        </div>
        <Form className="mr-3 mb-3">
          <FormControl
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form>
        {filteredVolunteers.map((volunteer) => (
          <VolunteerCard
            handleClick={(e) => handleVolunteerClick(e, volunteer)}
            volunteer={volunteer}
            key={volunteer.name}
            isActive={volunteer.id === selectedVolunteer.id}
          />
        ))}
      </section>

      {loadingDetails && (
        <Container id="volunteers-spinner">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      )}

      {selectedVolunteer.details && (
        <section
          id={page_id}
          className="d-flex flex-column p-5 m-5 bg-white shadow-sm w-50">
          <span className="p3">Letters</span>
          <div className="d-flex flex-row">
            <div className="d-flex flex-column letter-category">
              <span className="black-400 p4">In transit</span>
              {selectedVolunteer.details.letters
                .filter((letter) => letter.lob_status === 'letter.in_transit')
                .map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    handleClick={(e) => handleLetterClick(e, letter)}
                  />
                ))}
            </div>

            <div className="d-flex flex-column ml-5 letter-category">
              <span className="black-400 p4">Delivered</span>
              {selectedVolunteer.details.letters
                .filter(
                  (letter) =>
                    letter.lob_status === 'letter.processed_for_delivery',
                )
                .map((letter, index) => (
                  <LetterCard
                    letter={letter}
                    key={letter.id}
                    handleClick={(e) => handleLetterClick(e, letter)}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {selectedVolunteer.details && (
        <section
          id={page_id}
          className="volunteer-sidebar d-flex flex-column mr-4 bg-white p-5 shadow-sm">
          <div className="d-flex flex-column align-items-center">
            <Image
              src={selectedVolunteer.image}
              className="large-image"
              roundedCircle
            />
            <span className="black-500 font-weight-bold p3">
              {selectedVolunteer.name}
            </span>
            <span className="black-400">{selectedVolunteer.details.email}</span>
            <span className="black-400">
              {selectedVolunteer.details.city},{' '}
              {selectedVolunteer.details.state}
            </span>
          </div>
          <hr />
          <div className="d-flex flex-column">
            <span className="black-500 font-weight-bold">
              Contacts ({selectedVolunteer.details.contacts.length})
            </span>
            {selectedVolunteer.details.contacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        </section>
      )}

      {selectedLetter && (
        <LetterModal
          letter={selectedLetter}
          show={showLetterModal}
          handleClose={handleLetterClose}
        />
      )}

      <InviteModal
        shareLink="www.letters.ameelio.org"
        show={showInviteModal}
        handleClose={handleInviteClose}
      />
    </div>
  );
};

export default connector(UnconnectedVolunteers);
