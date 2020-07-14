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
      <section className="d-flex flex-column mw-25 border-right pl-4 shadow-sm bg-white rounded vh-100">
        {volunteers &&
          volunteers.map((volunteer) => (
            <VolunteerCard
              handleClick={(e) => handleVolunteerClick(e, volunteer)}
              volunteer={volunteer}
              key={volunteer.name}
              isActive={volunteer.id == selectedVolunteer.id}
            />
          ))}
      </section>
      <section className="d-flex flex-column p-5 m-5 bg-white shadow-sm w-50">
        <span className="black-500 p3">Letters</span>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column">
            <span className="black-300 p4">In transit</span>
            {selectedVolunteer &&
              selectedVolunteer.letters.map((letter) => (
                <LetterCard letter={letter} />
              ))}
          </div>

          <div className="d-flex flex-column ml-5">
            <span className="black-300 p4">Delivered</span>
            {selectedVolunteer &&
              selectedVolunteer.letters.map((letter) => (
                <LetterCard letter={letter} />
              ))}
          </div>
        </div>
      </section>

      <section className="d-flex flex-column mr-4 bg-white p-5 shadow-sm w-33">
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
          <span className="black-400 font-weight-bold">Contacts</span>
          {selectedVolunteer.contacts.map((contact) => (
            <ContactCard contact={contact} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Volunteers;
