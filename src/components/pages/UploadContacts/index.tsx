import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  uploadCsv,
  removeCsv,
  updateCsvUploadStep,
  updateCsvRows,
  addUploadTag,
  removeUploadTag,
} from 'src/redux/modules/orgcontacts';
import FunnelButton from 'src/components/buttons/FunnelButton';
import ProgressBarHeader from 'src/components/progress/ProgressBarHeader';
import Image from 'react-bootstrap/Image';
import Template from 'src/assets/template.png';
import { readString } from 'react-papaparse';
import FieldMappingTable from 'src/components/pages/UploadContacts/FieldMappingTable';
import { initialContactFieldMap } from 'src/data/InitialContactFieldMap';
import TagSelector from 'src/components/tags/TagSelector';
import { loadTags, createTag } from 'src/redux/modules/tag';
import ErrorAlert from 'src/components/alerts/ErrorAlert';

//TODO create object with all uploadedCSV properties
const mapStateToProps = (state: RootState) => ({
  uploadedCsv: state.orgContacts.uploadedCsv,
  uploadStep: state.orgContacts.uploadStep,
  uploadedCsvData: state.orgContacts.uploadedCsvData,
  uploadedCsvHeader: state.orgContacts.uploadedCsvHeader,
  tags: state.tags.tags,
  selectedTags: state.orgContacts.uploadSelectedTags,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      uploadCsv,
      updateCsvUploadStep,
      updateCsvRows,
      loadTags,
      createTag,
      addUploadTag,
      removeUploadTag,
      removeCsv,
    },
    dispatch,
  );
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedUploadContacts: React.FC<PropsFromRedux> = ({
  uploadCsv,
  removeCsv,
  uploadedCsv,
  uploadStep,
  updateCsvUploadStep,
  updateCsvRows,
  uploadedCsvData,
  uploadedCsvHeader,
  tags,
  loadTags,
  createTag,
  addUploadTag,
  removeUploadTag,
  selectedTags,
}) => {
  const [mapping, setMapping] = useState<ContactFieldMap>(
    initialContactFieldMap,
  );

  const [error, setError] = useState<ErrorFeedback | null>();

  const handleNextClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep - 1);
  };

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

      if (results.data.length < 2) {
        // ensure there are at least two rows of data
        removeCsv();
        setError({
          title: "Oops! There's something wrong with the file!",
          body:
            "It looks like your spreadsheet doesn't have any contacts. Make sure there's at least two rows of data.",
        });
      } else if ((results.data[0] as string[]).length < 8) {
        removeCsv();
        setError({
          title: "Oops! There's something wrong with the file!",
          body:
            "It looks like your spreadsheet doesn't have all the 8 columns that you need to create your contacts. Make sure that you follow the template below.",
        });
      } else {
        setError(null);
        updateCsvRows(results.data as string[][]);
      }
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
      {error && <ErrorAlert error={error} />}
      <div className="upload-file-container">
        <ProgressBarHeader
          step={uploadStep}
          stepLabels={['Upload contacts', 'Map fields', 'Tagging', 'Confirm!']}
        />

        <div className="mt-5 p-5 overflow-auto w-75 d-flex">
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
                Let's make sure that the columns in your uploaded csv map to the
                appropriate fields.
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
              <span>
                Assign existing tags or create new ones for your contacts.
              </span>
              <TagSelector
                tags={tags}
                selectedTags={selectedTags}
                addTag={addUploadTag}
                removeTag={removeUploadTag}
                showInputField={true}
                createTag={createTag}
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
