import React, { useState, useEffect } from 'react';
import { RootState } from 'src/redux';
import Docdrop from 'src/components/docdrop/Docdrop';
import Form from 'react-bootstrap/Form';
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

const mapStateToProps = (state: RootState) => ({
  uploadedCsv: state.orgContacts.uploadedCsv,
  uploadStep: state.orgContacts.uploadStep,
  uploadedCsvData: state.orgContacts.uploadedCsvData,
  uploadedCsvHeader: state.orgContacts.uploadedCsvHeader,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      uploadCsv,
      updateCsvUploadStep,
      updateCsvRows,
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
}) => {
  const handleNextClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep + 1);
  };

  const handleBackClick = (event: React.MouseEvent) => {
    updateCsvUploadStep(uploadStep - 1);
  };

  let fileReader: FileReader;
  const handFileRead = (e: any) => {
    const content = fileReader.result;
    if (typeof content == 'string') {
      const results = readString(content);
      updateCsvRows(results.data as string[][]);
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
          stepLabels={['Upload contacts', 'Map fields', 'Confirm!']}
        />

        <div className="mt-5 p-5">
          {uploadStep == 0 && (
            <div className="d-flex flex-column">
              <span>
                Upload a CSV file in this format. Need Help?{' '}
                <a
                  href="https://docs.google.com/spreadsheets/d/1PVDV_hBleSmkeNQ36-U0RUldqWLFyeuz-SufGbNMHHg/edit?usp=sharing"
                  target="_blank">
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
        </div>
      </div>
    </div>
  );
};

export default connector(UnconnectedUploadContacts);
