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

interface VolunteersProps {}

const Volunteers: React.FC<VolunteersProps> = () => {
  const dummy_contact: Contact = {
    first_name: 'Frankie',
    middle_name: '',
    last_name: 'Peters',
    inmate_number: '53213',
    facility_name: 'Cheshire CI',
    facility_address: '65 Edgewoo',
    facility_city: 'New Haven',
    facility_state: 'CT',
    facility_postal: '06511',
    profile_img_path:
      'https://media-exp1.licdn.com/dms/image/C4E03AQEvHsBEJbQ9dg/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=Boq-ITjNDiXYumLUoZWkYepKIH9ILrUH2B8is2uszLs',
    dorm: null,
    unit: null,
    total_letters_sent: 5,
    last_letter_sent: new Date(),
    letter_streak: 1,
  };

  const dummy_letter: Letter = {
    id: 0,
    created_at: new Date(),
    type: 'letter',
    content:
      'Good to see that you’re well and healthy! We’ve all missed you so much and can...',
    sent: true,
    attached_img_src:
      'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
    lob_validation_error: false,
    page_count: 1,
    tracking_events: [] as TrackingEvent[],
    user_name: 'Gabee',
    contact_name: 'Frankie',
  };

  const dummy_letters: Letter[] = [dummy_letter, dummy_letter];
  const dummy_contacts: Contact[] = [dummy_contact, dummy_contact];

  const dummy = {
    id: 0,
    name: 'Gabe Saruhashi',
    image:
      'https://media-exp1.licdn.com/dms/image/C5603AQHB6rggvacwQw/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=g7sRc3Gnmv-DmALMLW2oPM0wddRNwYHtmX1W4JFZO34',
    email: 'gabe@ameelio.org',
    letters: dummy_letters,
    contacts: dummy_contacts,
    city: 'São Paulo',
    state: 'SP',
    total_letters_sent: 2,
  };

  const dummy2 = {
    id: 1,
    name: 'Sarah Yoon',
    image:
      'https://media-exp1.licdn.com/dms/image/C5603AQGMME21TIGkrQ/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=XNtYv0Qy17ynPhOnUBnqk-8suzXg6dX7zE1m_MhBA3s',
    email: 'sarah@ameelio.org',
    letters: dummy_letters,
    contacts: dummy_contacts,
    city: 'New York',
    state: 'NYC',
    total_letters_sent: 2,
  };

  const volunteers: Volunteer[] = [dummy, dummy2];

  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>(
    volunteers,
  );
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer>(
    volunteers[0],
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [show, setShow] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleVolunteerClick = (
    event: React.MouseEvent,
    volunteer: Volunteer,
  ) => {
    setSelectedVolunteer(volunteer);
  };

  const handleLetterClick = (event: React.MouseEvent, letter: Letter) => {
    setSelectedLetter(letter);
    handleShow();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const results = volunteers.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredVolunteers(results);
  }, [searchQuery]);

  return (
    <div className="d-flex flex-row">
      <section className="volunteers-list-sidebar d-flex flex-column mw-25 border-right pl-4 shadow-sm bg-white rounded vh-100">
        <div className="d-flex flex-row justify-content-between align-items-center mt-5 mb-3 mr-3 ">
          <span className="black-400 p3">Volunteers</span>
          <Button>Invite</Button>
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
      {selectedLetter && (
        <LetterModal
          letter={selectedLetter}
          show={show}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default Volunteers;
