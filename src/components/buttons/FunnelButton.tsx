import React from 'react';
import Button from 'react-bootstrap/Button';

interface FunnelButtonProps {
  onClick: (event: React.MouseEvent) => void;
  onBack?: (event: React.MouseEvent) => void;
  cta: string;
  enabled: boolean;
}

const FunnelButton: React.FC<FunnelButtonProps> = ({
  onClick,
  onBack,
  cta,
  enabled,
}) => {
  return (
    <div className="d-flex flex-row w-100 mt-3">
      {onBack && (
        <Button
          size="lg"
          variant="outline-primary"
          className=""
          onClick={onBack}>
          Back;
        </Button>
      )}
      {enabled ? (
        <Button size="lg" className="ml-auto" onClick={onClick}>
          {cta} &#62;
        </Button>
      ) : (
        <Button size="lg" className="ml-auto" disabled>
          {cta} &#62;
        </Button>
      )}
    </div>
  );
};

export default FunnelButton;
