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
import { bindActionCreators, Dispatch } from 'redux';
import {
  loadVolunteers,
  selectVolunteer,
} from '../../../redux/modules/volunteer';
import { connect } from 'react-redux';

type VolunteersProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

// TODO move each section to its own container
const UnconnectedVolunteers: React.FC<VolunteersProps> = ({
  loadVolunteers,
  volunteers,
  selectVolunteer,
  selectedVolunteer,
}) => {
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(
    volunteers,
  );

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const handleLetterClose = () => setShowLetterModal(false);
  const handleLetterShow = () => setShowLetterModal(true);

  const handleInviteClose = () => setShowInviteModal(false);
  const handleInviteShow = () => setShowInviteModal(true);

  const handleVolunteerClick = (
    event: React.MouseEvent,
    volunteer: Volunteer,
  ) => {
    selectVolunteer(volunteer);
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
    if (volunteers.length === 0) {
      loadVolunteers();
    }

    const results = volunteers.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredVolunteers(results);
  }, [loadVolunteers, volunteers, searchQuery]);

  return (
    <div className="d-flex flex-row">
      <section className="volunteers-list-sidebar d-flex flex-column mw-25 border-right pl-4 shadow-sm bg-white rounded vh-100">
        <div className="d-flex flex-row justify-content-between align-items-center mt-5 mb-3 mr-3 ">
          <span className="black-400 p3">Volunteers</span>
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

      {selectedVolunteer.letters && (
        <section className="d-flex flex-column p-5 m-5 bg-white shadow-sm w-50">
          <span className="black-500 p3">Letters</span>
          <div className="d-flex flex-row">
            <div className="d-flex flex-column">
              <span className="black-300 p4">In transit</span>
              {selectedVolunteer.letters.map((letter) => (
                <LetterCard
                  letter={letter}
                  handleClick={(e) => handleLetterClick(e, letter)}
                />
              ))}
            </div>

            <div className="d-flex flex-column ml-5">
              <span className="black-300 p4">Delivered</span>
              {selectedVolunteer.letters.map((letter) => (
                <LetterCard
                  letter={letter}
                  handleClick={(e) => handleLetterClick(e, letter)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedVolunteer.contacts && (
        <section className="volunteer-sidebar d-flex flex-column mr-4 bg-white p-5 shadow-sm">
          <div className="d-flex flex-column align-items-center">
            <Image
              src={selectedVolunteer.image}
              className="large-image"
              roundedCircle
            />
            <span className="black-400 font-weight-bold p3">
              {selectedVolunteer.name}
            </span>
            <span className="black-300">{selectedVolunteer.email}</span>
            <span className="black-300">
              {selectedVolunteer.city}, {selectedVolunteer.state}
            </span>
          </div>
          <hr />
          <div className="d-flex flex-column">
            <span className="black-400 font-weight-bold">
              Contacts ({selectedVolunteer.contacts.length})
            </span>
            {selectedVolunteer.contacts.map((contact) => (
              <ContactCard contact={contact} />
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

const mapStateToProps = (state: RootState) => ({
  volunteers: state.volunteers.all_volunteers,
  selectedVolunteer: state.volunteers.selected_volunteer,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadVolunteers,
      selectVolunteer,
    },
    dispatch,
  );

const VolunteersPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedVolunteers);

export default VolunteersPage;
