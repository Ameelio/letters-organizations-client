import React from 'react';
import { formatDate } from '../../utils/utils';
import './LetterCard.css';

interface LetterCardProps {
  letter: Letter;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter }) => {
  return (
    <div className="letter-card d-flex flex-column py-3 px-5 mt-3 border  rounded ">
      <div className="d-flex flex-row justify-content-between">
        <span className="black-500">{letter.user_name}</span>
        <span className="primary">Sent {formatDate(letter.created_at)}</span>
      </div>
      <span className="black-300 letter-card-preview">{letter.content}</span>
      <span className="black-300">Read More</span>
    </div>
  );
};

export default LetterCard;
