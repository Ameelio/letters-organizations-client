import React from 'react';
import Image from 'react-bootstrap/Image';
import './VolunteerCard.css';

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
      </div>
      <hr />
    </div>
  );
};

export default VolunteerCard;
