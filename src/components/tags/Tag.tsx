import React from 'react';
import { generateTagColor } from '../../utils/utils';
import { sampleTagColors } from '../../data/TagColors';
import { X } from 'react-feather';

interface TagProps {
  tag: Tag;
  canRemove: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, canRemove }) => {
  return (
    <span className={`p-1 rounded ${generateTagColor(sampleTagColors, tag)}`}>
      {tag.label} ({tag.numContacts}){' '}
      {canRemove && <X color="#6d6d6d" size="12" />}
    </span>
  );
};

export default Tag;
