import React, { useEffect, useState } from 'react';
import Tag from './Tag';
import './TagSelector.css';

interface TagSelector {
  tags: Tag[];
  selectedTags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
  showTotalCount?: boolean;
  showInputField?: boolean;
  addNewTag?: (token: string, org_id: number, label: string) => void;
  token: string;
  orgId: number | null;
}

const TagSelector: React.FC<TagSelector> = ({
  tags,
  selectedTags,
  addTag,
  removeTag,
  showTotalCount,
  showInputField,
  addNewTag,
  token,
  orgId,
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
  const [inputField, setInputField] = useState<HTMLInputElement | null>();
  const [query, setQuery] = useState<string>('');

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
    setQuery('');
    addTag(tag);
  };

  useEffect(() => {
    setAvailableTags(
      tags.filter(
        (tag) =>
          !selectedTags.includes(tag) &&
          tag.label.toLowerCase().includes(query),
      ),
    );
    if (inputField) inputField.focus();
  }, [selectedTags, tags, inputField, query]);

  const handleTagCreation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    label: string,
  ) => {
    if (addNewTag && orgId) addNewTag(token, orgId, label);
    setQuery('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
  };

  return (
    <div className="w-100 mw-100">
      <div className="black-200-bg w-100 py-4 d-flex flex-row align-items-start">
        <div className="d-flex flex-row w-75 flex-wrap">
          {selectedTags.map((tag) => (
            <div
              className="ml-3 mb-3"
              key={tag.label}
              onClick={(e) => handleTagRemoval(e, tag)}>
              <Tag label={tag.label} canRemove={true} count={tag.numContacts} />
            </div>
          ))}
          {showInputField && (
            <input
              autoFocus
              ref={(input) => setInputField(input)}
              className="tag-selector-input black-200-bg ml-3 mb-3"
              type="text"
              value={query}
              onChange={handleSearchChange}
            />
          )}
        </div>

        {showTotalCount && (
          // TODO: Show correct total number of contacts instead of sum, which double-counts (low-priority)
          <span className="ml-auto mr-3 font-weight-bold black-400 flex-shrink-0">
            {selectedTags.reduce(
              (previousValue: number, currentValue: Tag) =>
                previousValue + currentValue.numContacts,
              0,
            )}{' '}
            contacts selected
          </span>
        )}
      </div>
      <div className="overflow-auto tag-selector-container d-flex flex-column shadow-sm bg-white py-3">
        {availableTags.map((tag) => (
          <div
            className="tag-row p-2 w-100"
            key={tag.label}
            onClick={(e) => handleTagSelection(e, tag)}>
            <Tag label={tag.label} count={tag.numContacts} />
          </div>
        ))}
        {addNewTag && query !== '' && (
          <div
            className="tag-row p-2 w-100"
            onClick={(e) => handleTagCreation(e, query)}>
            Create <Tag label={query} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
