import React, { useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import './Docdrop.css';
import { FileText, CheckCircle, XCircle } from 'react-feather';

interface DocdropProps {
  uploadFile: (file: File) => void;
  uploadedFile: File | null;
  acceptedFormat: string;
  acceptedFormatLabel: string;
}

const Docdrop: React.FC<DocdropProps> = ({
  uploadFile,
  uploadedFile,
  acceptedFormat,
  acceptedFormatLabel,
}) => {
  // TODO handle errors
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFormat,
    onDrop: (acceptedFiles) => {
      uploadFile(acceptedFiles[0]);
      setRejectedFiles([]);
    },
    onDropRejected: (rejectedFiles) => {
      setRejectedFiles(rejectedFiles);
    },
  });

  return (
    <section className="d-flex flex-column flex-align-items text-center">
      {uploadedFile && rejectedFiles.length === 0 && (
        <div className="d-flex flex-column align-items-center mb-3">
          {' '}
          <CheckCircle color="#2EBA77" size="38" />
          <span className="green font-weight-bold">Success</span>
        </div>
      )}
      {rejectedFiles.length > 0 && (
        <div className="d-flex flex-column align-items-center mb-3">
          {' '}
          <XCircle color="#DF6161" size="38" />
          <span className="red font-weight-bold">Something went wrong</span>
          <span className="mw-100 text-wrap overflow-wrap: break-word">
            {rejectedFiles[0].file.name} could not be uploaded. <br /> Only{' '}
            {acceptedFormatLabel} files are allowed. Please reupload your file.
          </span>
        </div>
      )}
      <div {...getRootProps({ className: 'docdrop' })}>
        <input {...getInputProps()} />
        <FileText />
        {uploadedFile ? (
          <div>
            <span>
              <span className="font-weight-bold">
                {(uploadedFile as CustomFile).path}
              </span>{' '}
              was uploaded succesfully
            </span>
          </div>
        ) : (
          <p className="mt-3">
            Drag and drop your PDF file here or{' '}
            <span className="primary">select a file to upload</span>
          </p>
        )}
      </div>
      {uploadedFile && (
        <span className="black-500 mt-3">
          Click to the next page to continue, or reupload your file.
        </span>
      )}
    </section>
  );
};

export default Docdrop;
