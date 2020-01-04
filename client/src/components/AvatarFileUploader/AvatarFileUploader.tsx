import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components/macro';
import dummyImage from 'assets/images/avatar_dummy.png';

const AvatarContainer = styled.section`
  position: relative;
  width: 130px;
  height: 130px;
  border: ${p => p.theme.border};
  border-radius: 100%;
  overflow: hidden;
  margin: 0px;

  .dropzone {
    position: absolute;
    width: 100%;
    height: 100%;
    line-height: 115px;
    text-align: center;
    background-color: rgba(88, 111, 253, 0.8);
    opacity: 0;
    cursor: pointer;
    color: ${p => p.theme.colors.common.white};

    &:hover {
      opacity: 1;
    }
  }

  .img__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

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
