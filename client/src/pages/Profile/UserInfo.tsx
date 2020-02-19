import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

import { getTimeDiff } from 'utils';
import Flex from 'components/common/Flex';
import CircleIcon from 'components/common/CircleIcon';
import Button, { ButtonGroup } from 'components/common/Button';

import Avatar from 'components/Avatar/Avatar';
import { UserInfoWrapper, UserMetaInfo } from './UserInfo.style';
import AvatarFileUploader from 'components/AvatarFileUploader/AvatarFileUploader';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAvatar } from 'store/ducks/auth';
import { StoreState } from 'store';
import { ToastText as Toast } from 'components/common/Toast';
import { notify } from 'react-notify-toast';

const customStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};
Modal.setAppElement('#root');

const StandOutText = styled.span`
  font-size: 1.5em;
  color: ${p => p.theme.colors.brand.primary};
  font-family: ${p => p.theme.font.primaryMedium};
`;
const StandOut: React.FC<{ value: any; children: React.ReactNode }> = ({
  value,
  children
}) => (
  <p>
    <StandOutText className="text--standout">{value + ' '}</StandOutText>
    {children}
  </p>
);

interface UserInfoProps {
  user: any;
  totalComments: string | number;
  totalBugs: string | number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  totalComments,
  totalBugs
}) => {
  const dispatch = useDispatch<any>();
  const [file, setFile] = useState<File>();
  const [modalIsOpen, setIsOpen] = useState(false);

  const currentUser = useSelector(
    (state: StoreState) => state.auth.user.username
  );
  const [isUploadPending] = useSelector((state: StoreState) => [
    state.loading['user/UPLOAD_AVATAR']
  ]);

  const onSubmit = () => {
    const formData = new FormData();
    file && formData.append('image', file);
    dispatch(updateUserAvatar(formData))
      .then(() => {
        setIsOpen(false);
        notify.show(<Toast>Profile picture updated</Toast>, 'success');
      })
      .catch((err: any) => {
        setIsOpen(false);
        setFile(undefined);
        notify.show(<Toast>{err}</Toast>, 'error');
      });
  };

  return (
    <UserInfoWrapper>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>
          <Flex align="center">
            <CircleIcon className="mr-10" icon="check" />
            Confirmation
          </Flex>
        </h2>
        <p>Are you sure you want to change your Profile Picture?</p>
        <br />
        <ButtonGroup float="right">
          <Button
            variant="danger"
            icon="times"
            onClick={() => {
              setIsOpen(false);
              setFile(undefined);
            }}
          >
            Cancel
          </Button>
          <Button icon="check" isLoading={isUploadPending} onClick={onSubmit}>
            Update Picture
          </Button>
        </ButtonGroup>
      </Modal>

      <UserMetaInfo>
        <div>
          {currentUser === user.username ? (
            <AvatarFileUploader
              size="150px"
              name="image"
              file={file}
              defaultImg={
                <Avatar
                  className="img__preview"
                  size={150}
                  username={user.username}
                />
              }
              handleFile={file => {
                setIsOpen(true);
                setFile(file);
              }}
            />
          ) : (
            <Avatar
              className="img__preview"
              size={150}
              username={user.username}
            />
          )}
        </div>
        <div>
          <h2 className="text--medium">{user.name}</h2>
          <span className="color--gray">@{user.username}</span>
          <p>{user.bio}</p>
        </div>
      </UserMetaInfo>
      <div>
        <StandOut value={totalComments || 0}>Comments</StandOut>
        <StandOut value={totalBugs || 0}>Bugs issued</StandOut>
        <StandOut value={'Joined'}>{getTimeDiff(user.date_joined)}</StandOut>
      </div>
    </UserInfoWrapper>
  );
};

export default UserInfo;
