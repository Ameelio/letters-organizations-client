import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FieldMappingRow from './FieldMappingRow';
import { min } from 'lodash';

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
    const index = value !== '' ? parseInt(value) : null;

    if (index === null) {
      mapping[key].index = null;
    } else {
      // if value was already selected, remove it
      const dupIndex = Object.entries(mapping).findIndex(
        ([key, map]) => map.index === index,
      );
      if (dupIndex !== -1) {
        mapping[
          Object.keys(mapping)[dupIndex] as keyof ContactFieldMap
        ].index = null;
      }

      mapping[key].index = index;
    }

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
