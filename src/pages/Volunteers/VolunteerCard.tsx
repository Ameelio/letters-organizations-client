import React, { FunctionComponent } from 'react';
import Image from 'react-bootstrap/Image';
import './VolunteerCard.css';

interface VolunteerProps {
  volunteer: Volunteer;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const VolunteerCard: React.FC<VolunteerProps> = ({
  volunteer,
  handleClick,
}) => {
  return (
    <div className="d-flex flex-row p-3 volunteer-card" onClick={handleClick}>
      <Image className="small-image" src={volunteer.image} roundedCircle />
      <span>{volunteer.name}</span>
    </div>
  );
};

export default VolunteerCard;
