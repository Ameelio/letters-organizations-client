import React, { useState, useEffect } from 'react';
import { sampleTagColors } from '../../../data/TagColors';
import { generateTagColor } from '../../../utils/utils';
import Form from 'react-bootstrap/Form';
import Tag from '../../tags/Tag';

interface TagSelector {
  tags: Tag[];
}

// TODO for select all contacts, we probably want to pass a flag to the sendNewsletter
const TagSelector: React.FC<TagSelector> = ({ tags }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);

  const handleTagRemoval = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Tag,
  ) => {
    setAvailableTags([...availableTags, tag]);
    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag.label !== tag.label),
    );
  };

  const handleTagSelection = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Tag,
  ) => {
    setSelectedTags([...selectedTags, tag]);
    setAvailableTags(
      availableTags.filter((availableTag) => availableTag.label !== tag.label),
    );
  };

  useEffect(() => {
    setAvailableTags(tags);
  }, [tags]);

  return (
    <div className="mw-100">
      <div className="black-200-bg w-100 py-4 d-flex flex-row align-items-start">
        <div className="d-flex flex-row w-75 flex-wrap">
          {selectedTags.map((tag) => (
            <div
              className="ml-3 mb-3"
              key={tag.label}
              onClick={(e) => handleTagRemoval(e, tag)}>
              <Tag tag={tag} canRemove={true} />
            </div>
          ))}
        </div>

        <span className="ml-auto mr-3 font-weight-bold black-400 flex-shrink-0">
          {selectedTags.reduce(
            (previousValue: number, currentValue: Tag) =>
              previousValue + currentValue.numContacts,
            0,
          )}{' '}
          contacts selected
        </span>
      </div>
      <div className="d-flex flex-column shadow-sm bg-white p-3">
        {availableTags.map((tag) => (
          <div
            className="tag mb-3"
            key={tag.label}
            onClick={(e) => handleTagSelection(e, tag)}>
            <Tag tag={tag} canRemove={false} />
          </div>
        ))}
      </div>
      <Form.Check type="checkbox" label="Select all 7311 contacts" />
    </div>
  );
};

export default TagSelector;
