import React from 'react';
import Tag from '../../tags/Tag';

interface TagSelector {
  availableTags: Tag[];
  selectedTags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
  //   setSelectedTags:
}

// TODO for select all contacts, we probably want to pass a flag to the sendNewsletter
const TagSelector: React.FC<TagSelector> = ({
  availableTags,
  selectedTags,
  addTag,
  removeTag,
}) => {
  const handleTagRemoval = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Tag,
  ) => {
    removeTag(tag);
  };

  const handleTagSelection = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Tag,
  ) => {
    addTag(tag);
  };

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
    </div>
  );
};

export default TagSelector;
