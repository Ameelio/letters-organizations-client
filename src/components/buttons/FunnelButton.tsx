import React from 'react';
import Button from 'react-bootstrap/Button';

interface FunnelButtonProps {
  onClick: (event: React.MouseEvent) => void;
  cta: string;
  enabled: boolean;
}

const FunnelButton: React.FC<FunnelButtonProps> = ({
  onClick,
  cta,
  enabled,
}) => {
  return (
    <div className="d-flex w-100">
      {enabled ? (
        <Button size="lg" className="ml-auto mt-3" onClick={onClick}>
          {cta} &#62;
        </Button>
      ) : (
        <Button size="lg" className="ml-auto mt-3" disabled>
          {cta} &#62;
        </Button>
      )}
    </div>
  );
};

export default FunnelButton;
