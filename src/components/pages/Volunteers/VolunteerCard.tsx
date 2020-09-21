import React from 'react';
import Image from 'react-bootstrap/Image';
import './VolunteerCard.css';
import { formatDate } from 'src/utils/utils';

interface VolunteerProps {
  volunteer: Volunteer;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
}

const VolunteerCard: React.FC<VolunteerProps> = ({
  volunteer,
  handleClick,
  isActive,
}) => {
  const activeBorder = isActive ? 'volunteer-card-active' : '';
  const fontColor = isActive ? 'primary' : 'black-500';
  return (
    <div
      className={`d-flex flex-row  pr-3 py-4 volunteer-card border-bottom ${activeBorder}`}
      onClick={handleClick}>
      <Image className="small-image p4" src={volunteer.image} roundedCircle />
      <div className="ml-4 d-flex flex-column">
        <span className={`${fontColor} p4`}>{volunteer.name}</span>
        <span className="black-400 p6">
          Total letters sent: {volunteer.total_letters_sent}
        </span>
        <span className="black-400 p6">
          {volunteer.last_letter_sent
            ? `Last letter sent: ${formatDate(volunteer.last_letter_sent)}`
            : 'No letters sent yet!'}
        </span>
      </div>
      <hr />
    </div>
  );
};

export default VolunteerCard;
