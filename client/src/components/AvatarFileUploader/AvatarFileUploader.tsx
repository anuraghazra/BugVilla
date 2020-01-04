import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import dummyImage from 'assets/images/avatar_dummy.png';
import AvatarContainer from './AvatarFileUploader.style';

interface Props {
  name?: string;
  inputRef?: any;
  file: any;
  handleFile: (file: any) => void;
}

const AvatarFileUploader: React.FC<Props> = ({
  name,
  inputRef,
  handleFile,
  file
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    maxSize: 1 * 1024 * 1024,
    onDrop: (acceptedFiles: any) => {
      acceptedFiles[0].preview = URL.createObjectURL(acceptedFiles[0]);
      handleFile(acceptedFiles[0]);
    }
  });

  // prettier-ignore
  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    file && URL.revokeObjectURL(file.preview);
  }, [file]);

  return (
    <AvatarContainer>
      <div className="dropzone" {...getRootProps({ className: 'dropzone' })}>
        <input type="file" name={name} ref={inputRef} {...getInputProps()} />
        <p>Upload Image</p>
      </div>

      {file ? (
        <img key={file.name} className="img__preview" src={file.preview} />
      ) : (
        <img className="img__preview" src={dummyImage} />
      )}
    </AvatarContainer>
  );
};

export default AvatarFileUploader;
