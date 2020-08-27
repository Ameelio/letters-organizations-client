import React from 'react';
import Image from 'react-bootstrap/Image';
import { formatDate } from 'src/utils/utils';
import './ContactCard.css';

interface ContactCardProps {
  contact: VolunteerContact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <div className="d-flex flex-column py-4 border-bottom contact-card">
      <div className="d-flex flex-row">
        <Image
          src={contact.profile_img_path}
          className="small-image"
          roundedCircle
        />
        <div className="d-flex flex-column ml-3">
          <span className="black-500">
            {contact.first_name} {contact.last_name}
          </span>
          <span className="black-400">{contact.inmate_number}</span>
          <span className="black-400">{contact.facility_name}</span>
        </div>
      </div>
      <div className="d-flex flex-row black-200-bg mt-3">
        <div className="d-flex flex-column align-items-center p-1">
          <span className="black-400 p7">Letters sent</span>
          <span className="black-400 p6">{contact.total_letters_sent}</span>
        </div>
        <div className="d-flex flex-column align-items-center p-1">
          <span className="black-400 p7">Last sent</span>
          <span className="black-400 p6">
            {contact.last_letter_sent
              ? formatDate(contact.last_letter_sent)
              : 'None'}
          </span>
        </div>
        <div className="d-flex flex-column align-items-center p-1">
          <span className="black-400 p7">Relationship</span>
          <span className="black-400 p6">{contact.relationship}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
