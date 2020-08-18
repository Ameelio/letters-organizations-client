import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

interface Props {
  value: boolean;
  setValue: (value: boolean) => void;
  defaultLabel: string;
  otherLabel: string;
}

export default function Toogle({
  value,
  setValue,
  defaultLabel,
  otherLabel,
}: Props) {
  const handleChange = (e: boolean) => {
    setValue(e);
  };

  return (
    <ToggleButtonGroup
      type="radio"
      value={value}
      name="options"
      onChange={handleChange}>
      <ToggleButton value={false} variant="outline-primary">
        {defaultLabel}
      </ToggleButton>
      <ToggleButton value={true} variant="outline-primary">
        {otherLabel}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
