import React, { FunctionComponent } from 'react';
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
  const activeFont = isActive ? 'primary' : 'black-400';
  return (
    <div
      className={`d-flex flex-row  pr-3 py-4 volunteer-card border-bottom ${activeBorder}`}
      onClick={handleClick}>
      <Image className="small-image p4" src={volunteer.image} roundedCircle />
      <span className={`ml-5 black ${activeFont}`}>{volunteer.name}</span>
      <hr />
    </div>
  );
};

export default VolunteerCard;
