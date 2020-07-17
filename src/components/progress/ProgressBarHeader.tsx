import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface ProgressBarHeaderProps {
  step: number;
  stepLabels: string[];
}

const ProgressBarHeader: React.FC<ProgressBarHeaderProps> = ({
  step,
  stepLabels,
}) => {
  return (
    <div className="w-100">
      <ProgressBar now={Math.round((step + 1) * (100 / stepLabels.length))} />
      <div className="d-flex flex-row justify-content-around mt-2">
        {stepLabels.map((label, index) => (
          <span
            className={
              step >= index ? 'font-weight-bold primary' : 'black-300'
            }>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBarHeader;
