import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadCsv,
  updateCsvUploadStep,
  updateCsvRows,
} from 'src/redux/modules/orgcontacts';
import FunnelButton from 'src/components/buttons/FunnelButton';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import Image from 'react-bootstrap/Image';
import Template from 'src/assets/template.png';
import { readString } from 'react-papaparse';
import FieldMappingTable from 'src/components/pages/UploadContacts/FieldMappingTable';
import { initialContactFieldMap } from 'src/data/InitialContactFieldMap';
import TagSelector from 'src/components/tags/TagSelector';
import { loadTags } from 'src/redux/modules/tag';

const mapStateToProps = (state: RootState) => ({
  uploadedCsv: state.orgContacts.uploadedCsv,
  uploadStep: state.orgContacts.uploadStep,
  uploadedCsvData: state.orgContacts.uploadedCsvData,
  uploadedCsvHeader: state.orgContacts.uploadedCsvHeader,
  tags: state.tags.tags,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      uploadCsv,
      updateCsvUploadStep,
      updateCsvRows,
      loadTags,
    },
    dispatch,
  );
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedUploadContacts: React.FC<PropsFromRedux> = ({
  uploadCsv,
  uploadedCsv,
  uploadStep,
  updateCsvUploadStep,
  updateCsvRows,
  uploadedCsvData,
  uploadedCsvHeader,
  tags,
  loadTags,
}) => {
  const [mapping, setMapping] = useState<ContactFieldMap>(
    initialContactFieldMap,
  );

  const [selectedTags, setSelectedTags] = useState<Tag[]>([] as Tag[]);

  const handleNextClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep - 1);
  };

  const addTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const removeTag = (tag: Tag) => {
    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag.id !== tag.id),
    );
  };
  // TODO: make this more robust \ edge cases: no rows, no data

  useEffect(() => {
    if (tags.length === 0) {
      loadTags();
    }
  });

  let fileReader: FileReader;
  const handFileRead = (e: any) => {
    const content = fileReader.result;
    if (typeof content == 'string') {
      const results = readString(content);

      results.data.length > 2
        ? updateCsvRows(results.data as string[][])
        : alert('Your CSV needs to have at least two rows of data');
    }
  };

  const handleFileChosen = (file: File) => {
    fileReader = new FileReader();
    fileReader.onloadend = handFileRead;
    fileReader.readAsText(file);
  };

  useEffect(() => {
    if (uploadedCsv) {
      handleFileChosen(uploadedCsv);
    }
  });
  return (
    <div className="upload-file-wrapper">
      <div className="upload-file-container">
        <ProgressBarHeader
          step={uploadStep}
          stepLabels={['Upload contacts', 'Map fields', 'Tagging', 'Confirm!']}
        />

        <div className="mt-5 p-5 overflow-auto w-75">
          {uploadStep === 0 && (
            <div className="d-flex flex-column align-items-center">
              <span>
                Upload a CSV file in this format. Need Help?{' '}
                <a
                  href="https://docs.google.com/spreadsheets/d/1PVDV_hBleSmkeNQ36-U0RUldqWLFyeuz-SufGbNMHHg/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer">
                  Download our CSV template
                </a>
              </span>
              <Image src={Template} className="mb-5" />
              <Docdrop
                uploadFile={uploadCsv}
                uploadedFile={uploadedCsv}
                acceptedFormat="text/csv/*"
                acceptedFormatLabel="CSV"
              />
              <div className="ml-auto">
                <FunnelButton
                  cta="Next"
                  onClick={handleNextClick}
                  enabled={uploadedCsv !== null}
                />
              </div>
            </div>
          )}

          {uploadStep === 1 && (
            <div className="d-flex flex-column w-100">
              <span>
                Let's map the columns in your uploaded csv to your desired
                fields
              </span>
              <div className="w-100 shadow-sm p-3 mt-3">
                <FieldMappingTable
                  headers={uploadedCsvHeader}
                  sample={uploadedCsvData[0]}
                  mapping={mapping}
                  setMapping={setMapping}
                />
              </div>
              <FunnelButton
                cta="Next"
                onClick={handleNextClick}
                onBack={handleBackClick}
                enabled={uploadedCsv !== null}
              />
            </div>
          )}

          {uploadStep === 2 && (
            <div className="d-flex flex-column w-100">
              <span>Assign or create tags to your new contacts.</span>
              <TagSelector
                tags={tags}
                selectedTags={selectedTags}
                addTag={addTag}
                removeTag={removeTag}
                showInputField={true}
                allowTagCreation={true}
              />
              <FunnelButton
                cta="Next"
                onClick={handleNextClick}
                onBack={handleBackClick}
                enabled={uploadedCsv !== null}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connector(UnconnectedUploadContacts);
