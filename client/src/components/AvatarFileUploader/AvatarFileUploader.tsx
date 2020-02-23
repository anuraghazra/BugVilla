import React, { useEffect } from 'react';
import { notify } from 'react-notify-toast';
import { useDropzone } from 'react-dropzone';

import Toast from 'components/common/Toast';
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
        notify.show(<Toast>Something went crazy!</Toast>, 'error');
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

      {file ? (
        <img key={file.name} className="img__preview" src={file.preview} />
      ) : (
        defaultImg
      )}
    </AvatarContainer>
  );
};

export default AvatarFileUploader;
