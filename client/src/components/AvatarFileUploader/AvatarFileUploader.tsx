import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import { toast } from '@bug-ui';
import AvatarContainer from './AvatarFileUploader.style';

interface PreviewFile extends File {
  preview?: any;
}
interface Props {
  name?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  file?: PreviewFile;
  defaultImg?: any;
  handleFile: (file: PreviewFile) => void;
  size?: string;
}

const AvatarFileUploader: React.FC<Props> = ({
  name,
  inputRef,
  handleFile,
  defaultImg,
  file,
  size
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    maxSize: 1 * 1024 * 1024,
    onDrop: (acceptedFiles: PreviewFile[]): void => {
      try {
        acceptedFiles[0].preview = URL.createObjectURL(acceptedFiles[0]);
        handleFile(acceptedFiles[0]);
      } catch (err) {
        toast.error('Something went crazy!');
      }
    }
  });

  // prettier-ignore
  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    file && URL.revokeObjectURL(file.preview);
  }, [file]);

  return (
    <AvatarContainer size={size}>
      <div className="dropzone" {...getRootProps({ className: 'dropzone' })}>
        <input type="file" name={name} ref={inputRef} {...getInputProps()} />
        <p>Change Avatar</p>
      </div>

      <img
        className="avatar-uploader--preview"
        alt={file ? 'Avatar image' : 'Default Avatar Image'}
        src={file ? file.preview : defaultImg}
      />
    </AvatarContainer>
  );
};

export default AvatarFileUploader;
