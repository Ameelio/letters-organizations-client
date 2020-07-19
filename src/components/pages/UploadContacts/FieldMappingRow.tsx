import React from 'react';
import Form from 'react-bootstrap/Form';

interface Props {
  options: string[];
  objKey: keyof ContactFieldMap;
  map: FieldMap;
  sample: string[];
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    fieldName: keyof ContactFieldMap,
  ) => void;
}

const FieldMappingRow: React.FC<Props> = ({
  options,
  objKey,
  map,
  sample,
  onChange,
}) => {
  return (
    <tr>
      <td>{map.field}</td>
      <td>
        <Form.Control
          as="select"
          value={typeof map.index === 'number' ? map.index : ''}
          onChange={(e) =>
            onChange(e as React.ChangeEvent<HTMLSelectElement>, objKey)
          }
          custom>
          <option value=""></option>
          {options.map((option: string, index: number) => (
            <option value={index} key={index}>
              {option}
            </option>
          ))}
        </Form.Control>
      </td>
      <td>{typeof map.index === 'number' && sample[map.index]}</td>
    </tr>
  );
};

export default FieldMappingRow;
