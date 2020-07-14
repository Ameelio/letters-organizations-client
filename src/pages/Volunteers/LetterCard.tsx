import React from 'react';
import { formatDate } from '../../utils/utils';

interface LetterCardProps {
  letter: Letter;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter }) => {
  return (
    <div className="d-flex flex-column py-3 px-5 mt-3 border border-light rounded ">
      <div className="d-flex flex-row">
        <span>{letter.user_name}</span>
        <span className="ml-5">{formatDate(letter.created_at)}</span>
      </div>
      <span>{letter.content}</span>
      <span>Read More</span>
    </div>
  );
};

export default LetterCard;
