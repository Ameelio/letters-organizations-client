import React, { useState, useEffect } from 'react';
import VolunteerCard from './VolunteerCard';
import LetterCard from './LetterCard';
import Image from 'react-bootstrap/Image';
import ContactCard from './ContactCard';

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
      'https://media-exp1.licdn.com/dms/image/C5603AQHtpK5SgD0Kkg/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=5geQy0h2dCWKum5krw8DaftnK4JQDqYf0LRIxtE7UsI',
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
    content: 'Hello world',
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
  };

  const dummy2 = {
    id: 0,
    name: 'Sarah Yoon',
    image:
      'https://media-exp1.licdn.com/dms/image/C5603AQHB6rggvacwQw/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=g7sRc3Gnmv-DmALMLW2oPM0wddRNwYHtmX1W4JFZO34',
    email: 'sarah@ameelio.org',
    letters: dummy_letters,
    contacts: dummy_contacts,
    city: 'New York',
    state: 'NYC',
  };

  const volunteers: Volunteer[] = [dummy, dummy2];

  const [selectedVolunteer, setSelectedVolunteer] = useState(volunteers[0]);

  const handleVolunteerClick = (
    event: React.MouseEvent,
    volunteer: Volunteer,
  ) => {
    setSelectedVolunteer(volunteer);
  };

  return (
    <div className="d-flex flex-row">
      <section className="d-flex flex-column w-25 border-right shadow bg-white rounded p-5 vh-100">
        {volunteers &&
          volunteers.map((volunteer) => (
            <VolunteerCard
              handleClick={(e) => handleVolunteerClick(e, volunteer)}
              volunteer={volunteer}
              key={volunteer.id}
            />
          ))}
      </section>
      <section className="d-flex flex-row p-5 m-5 bg-white">
        <div className="d-flex flex-column">
          <span>In transit</span>
          {selectedVolunteer &&
            selectedVolunteer.letters.map((letter) => (
              <LetterCard letter={letter} />
            ))}
        </div>

        <div className="d-flex flex-column ml-5">
          <span>Delivered</span>
          {selectedVolunteer &&
            selectedVolunteer.letters.map((letter) => (
              <LetterCard letter={letter} />
            ))}
        </div>
      </section>

      <section className="d-flex flex-column ml-auto mr-5 bg-white p-5">
        <div className="d-flex flex-column align-items-center">
          <Image
            src={selectedVolunteer.image}
            className="large-image"
            roundedCircle
          />
          <span>{selectedVolunteer.name}</span>
          <span>
            {selectedVolunteer.city}, {selectedVolunteer.state}
          </span>
        </div>
        <hr />
        <div className="d-flex flex-column">
          <span>Contacts</span>
          {selectedVolunteer.contacts.map((contact) => (
            <ContactCard contact={contact} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Volunteers;
