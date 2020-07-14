import React from 'react';
import Image from 'react-bootstrap/Image';
import { formatDate } from '../../utils/utils';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <div className="d-flex flex-column p-3">
      <div className="d-flex flex-row">
        <Image
          src={contact.profile_img_path}
          className="small-image"
          roundedCircle
        />
        <div className="d-flex flex-column">
          <span>
            {contact.first_name} {contact.last_name}
          </span>
          <span>{contact.inmate_number}</span>
          <span>{contact.facility_name}</span>
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="d-flex flex-column align-items-center p-1">
          <span>Letters sent</span>
          <span>{contact.total_letters_sent}</span>
        </div>
        <div className="d-flex flex-column align-items-center p-1">
          <span>Streak</span>
          <span>{contact.letter_streak}</span>
        </div>
        <div className="d-flex flex-column align-items-center p-1">
          <span>Last sent</span>
          <span>{formatDate(contact.last_letter_sent)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
