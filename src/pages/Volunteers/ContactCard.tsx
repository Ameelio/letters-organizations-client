import React from 'react';
import Image from 'react-bootstrap/Image';
import { formatDate } from '../../utils/utils';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <div className="d-flex flex-column py-4 border-bottom">
      <div className="d-flex flex-row">
        <Image
          src={contact.profile_img_path}
          className="small-image"
          roundedCircle
        />
        <div className="d-flex flex-column ml-3">
          <span className="black-400">
            {contact.first_name} {contact.last_name}
          </span>
          <span className="black-300">{contact.inmate_number}</span>
          <span className="black-300">{contact.facility_name}</span>
        </div>
      </div>
      <div className="d-flex flex-row black-200-bg mt-3">
        <div className="d-flex flex-column align-items-center p-2">
          <span className="black-300 p7">Letters sent</span>
          <span className="black-400">{contact.total_letters_sent}</span>
        </div>
        <div className="d-flex flex-column align-items-center p-2">
          <span className="black-300 p7">Streak</span>
          <span className="black-400">{contact.letter_streak}</span>
        </div>
        <div className="d-flex flex-column align-items-center p-2">
          <span className="black-300 p7">Last sent</span>
          <span className="black-400">
            {formatDate(contact.last_letter_sent)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
