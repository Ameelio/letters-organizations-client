import React, { useState, useEffect } from 'react';
import VolunteerCard from './VolunteerCard';
import VolunteerDetails from './VolunteerDetails';
import LetterCard from './LetterCard';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import './index.css';
import LetterModal from './LetterModal';
import InviteModal from './InviteModal';
import { RootState } from '../../../redux';
import { bindActionCreators, Dispatch } from 'redux';
import { logout } from '../../../redux/modules/user';
import {
  loadVolunteers,
  selectVolunteer,
  loading,
  inviteVolunteer,
  handleError,
} from 'src/redux/modules/volunteer';
import {
  updateVolunteer,
  removeVolunteer,
} from '../../../services/Api/volunteers';
import { unauthenticated } from 'src/utils/utils';
import { connect, ConnectedProps } from 'react-redux';
import { Card, Container, Spinner } from 'react-bootstrap';
import { addBusinessDays, differenceInBusinessDays } from 'date-fns';

const mapStateToProps = (state: RootState) => ({
  volunteers: state.volunteers,
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadVolunteers,
      selectVolunteer,
      loading,
      logout,
      inviteVolunteer,
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
  loading,
  user,
  logout,
}) => {
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(
    volunteers.all_volunteers,
  );

  const token = user.user.token;
  const org = user.user.org;

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [hasFetchedVolunteers, setHasFetchedVolunteers] = useState<boolean>(
    false,
  );

  const handleLetterClose = () => setShowLetterModal(false);
  const handleLetterShow = () => setShowLetterModal(true);

  const handleInviteClose = () => setShowInviteModal(false);
  const handleInviteShow = () => setShowInviteModal(true);

  const handleUpdateClose = () => setShowUpdateForm(false);
  const handleUpdateShow = () => setShowUpdateForm(true);

  const handleVolunteerClick = (
    event: React.MouseEvent,
    volunteer: Volunteer,
  ) => {
    handleUpdateClose();
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
    if (!hasFetchedVolunteers && org) {
      loadVolunteers(token, org.id);
      setHasFetchedVolunteers(true);
    }
    const results = volunteers.all_volunteers.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredVolunteers(results);
  }, [
    hasFetchedVolunteers,
    loadVolunteers,
    volunteers.all_volunteers,
    searchQuery,
  ]);

  if (unauthenticated([volunteers.error.message])) {
    loading();
    logout();
  }
  let problemLoadingDetails = null;
  if (volunteers.error.data) {
    if ('org_users' in volunteers.error.data) {
      loading();
      logout();
    }
    if ('org_user' in volunteers.error.data) {
      if (volunteers.error.message === 'Associated User not found') {
        problemLoadingDetails = volunteers.error.data['org_user'];
      }
    }
  }

  const spinner = (
    <Container id="volunteers-spinner">
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  );

  if (volunteers.loading) {
    return spinner;
  }

  let page_id = 'content';
  if (volunteers.loading_details) {
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
            isActive={volunteer.id === volunteers.selected_volunteer.id}
          />
        ))}
      </section>

      {volunteers.loading_details && spinner}

      {problemLoadingDetails && (
        <Container id="problem-loading-info">
          <Card body>
            There was a problem loading this volunteer's information.{' '}
            {problemLoadingDetails}
          </Card>
        </Container>
      )}

      {volunteers.selected_volunteer.details && (
        <section
          id={page_id}
          className="d-flex flex-column p-5 m-5 bg-white shadow-sm w-50">
          <span className="p3">Letters</span>
          <div className="d-flex flex-row">
            <div className="d-flex flex-column letter-category">
              <span className="black-400 p4">In transit</span>
              {volunteers.selected_volunteer.details.letters
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
              {volunteers.selected_volunteer.details.letters
                .filter((letter) => {
                  const now = new Date();
                  return (
                    letter.last_lob_status_update &&
                    differenceInBusinessDays(
                      now,
                      letter.last_lob_status_update,
                    ) >= 3 &&
                    letter.lob_status === 'letter.processed_for_delivery'
                  );
                })
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

      {volunteers.selected_volunteer.details && org && (
        <VolunteerDetails
          volunteer={volunteers.selected_volunteer}
          page_id={page_id}
          showUpdateForm={showUpdateForm}
          handleUpdateClose={handleUpdateClose}
          handleUpdateShow={handleUpdateShow}
          token={token}
          orgId={org.id}
          updateVolunteer={updateVolunteer}
          selectVolunteer={selectVolunteer}
          removeVolunteer={removeVolunteer}
          loadVolunteers={loadVolunteers}
          handleError={handleError}
          user={user.user}
        />
      )}

      {selectedLetter && (
        <LetterModal
          letter={selectedLetter}
          show={showLetterModal}
          handleClose={handleLetterClose}
        />
      )}

      {org && (
        <InviteModal
          shareLink={org.share_link}
          show={showInviteModal}
          handleClose={handleInviteClose}
          token={token}
          orgId={org ? org.id : null}
        />
      )}
    </div>
  );
};

export default connector(UnconnectedVolunteers);
