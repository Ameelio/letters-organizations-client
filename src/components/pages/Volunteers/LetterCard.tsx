import React from 'react';
import { formatDate } from '../../../utils/utils';
import './LetterCard.css';

interface LetterCardProps {
  letter: Letter;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="letter-card d-flex flex-column py-3 px-5 mt-3 border  rounded ">
      <div className="d-flex flex-row justify-content-between">
        <span className="black-500">{letter.contact_name}</span>
        <span className="primary">Sent {formatDate(letter.created_at)}</span>
      </div>
      <span className="black-300 letter-card-preview">{letter.content}</span>
      <span className="black-300">Read More</span>
    </div>
  );
};

export default LetterCard;
