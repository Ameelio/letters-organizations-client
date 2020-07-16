import React from 'react';
import { useDropzone } from 'react-dropzone';
import './Docdrop.css';
import { FileText, CheckCircle } from 'react-feather';

interface DocdropProps {
  uploadFile: (file: File) => void;
  uploadedFile: File | null;
}

const Docdrop: React.FC<DocdropProps> = ({ uploadFile, uploadedFile }) => {
  // TODO handle errors
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf/*',
    onDrop: (acceptedFiles) => {
      uploadFile(acceptedFiles[0]);
    },
  });

  return (
    <section className="d-flex flex-column flex-align-items text-center">
      {uploadedFile && (
        <div className="d-flex flex-column align-items-center mb-3">
          {' '}
          <CheckCircle color="#2EBA77" size="38" />
          <span className="green font-weight-bold">Success</span>
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
