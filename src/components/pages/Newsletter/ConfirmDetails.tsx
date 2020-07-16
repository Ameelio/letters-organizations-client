import React from 'react';

interface ConfirmDetailsProps {
  title: string;
  uploadedFile: File;
}

const ConfirmDetails: React.FC<ConfirmDetailsProps> = ({
  title,
  uploadedFile,
}) => {
  return (
    <div className="d-flex flex-column">
      <span className="p2">Confirm these details</span>
      <span>What is being sent?</span>
      <div>
        <span>Newsletter title</span>
        <span>{title}</span>
      </div>
      <div></div>
    </div>
  );
};
