import React from 'react';
import Table from 'react-bootstrap/Table';
import FieldMappingRow from './FieldMappingRow';

interface Props {
  mapping: ContactFieldMap;
  headers: string[];
  sample: string[];
  setMapping: (updatedMapping: ContactFieldMap) => void;
}

const FieldMappingTable: React.FC<Props> = ({
  mapping,
  headers,
  sample,
  setMapping,
}) => {
  const onChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: keyof ContactFieldMap,
  ) => {
    const { value } = event.currentTarget;
    const index = parseInt(value);

    // if value was already selected, remove it
    const dupIndex = Object.entries(mapping).findIndex(
      ([, map]) => map.index === index,
    );
    if (dupIndex !== -1) {
      mapping[
        Object.keys(mapping)[dupIndex] as keyof ContactFieldMap
      ].index = -1;
    }
    mapping[key].index = index;

    setMapping(mapping);
  };

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Field</th>
          <th>Mapped to CSV Column</th>
          <th>Sample</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(mapping).map(([key, value]) => (
          <FieldMappingRow
            key={key}
            objKey={key as keyof ContactFieldMap}
            map={value as FieldMap}
            options={headers}
            sample={sample}
            onChange={onChange}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default FieldMappingTable;
