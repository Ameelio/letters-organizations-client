import React from 'react';
import { generateTagColor } from '../../utils/utils';
import { sampleTagColors } from '../../data/TagColors';
import { X } from 'react-feather';

interface TagProps {
  label: string;
  count?: number;
  canRemove?: boolean;
}

const Tag: React.FC<TagProps> = ({ label, canRemove, count }) => {
  return (
    <span className={`p-1 rounded ${generateTagColor(sampleTagColors, label)}`}>
      {label} {count} {canRemove && <X color="#6d6d6d" size="12" />}
    </span>
  );
};

export default Tag;
