import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from 'react-notify-toast';

import { getTimeDiff } from 'utils';
import Avatar from 'components/common/Avatar';
import Button, { ButtonGroup } from 'components/common/Button';
import CircleIcon from 'components/common/CircleIcon';
import Flex from 'components/common/Flex';
import Toast from 'components/common/Toast';
import { Textarea } from 'components/common/Form/Input';

import { StoreState } from 'store';
import { updateUserAvatar, updateUserBio } from 'store/ducks/auth';
import { UserInfoWrapper, UserMetaInfo } from './UserInfo.style';
import AvatarFileUploader from 'components/AvatarFileUploader/AvatarFileUploader';

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

const StandOut = styled.p<{ prefix: any }>`
  &:before {
    content: '${p => p.prefix} ';
    font-size: 1.5em;
    color: ${p => p.theme.colors.brand.primary};
    font-family: ${p => p.theme.font.primaryMedium};
  }
`;


const Bio: React.FC<{ user: any; currentUser: any }> = ({
  user,
  currentUser
}) => {
  const dispatch = useDispatch<any>();
  const isBioLoading = useSelector(
    (state: StoreState) => state.loading['user/UPDATE_BIO']
  );
  const [isBioEditing, setBioEditing] = useState(false);
  const toggleBioEdit = () => {
    setBioEditing(!isBioEditing);
  };

  const updateBio = (e: any) => {
    setBioEditing(false);
    dispatch(updateUserBio({ bio: e.target.value }))
      .then(() => {
        notify.show(<Toast>Bio updated</Toast>, 'success');
      })
      .catch((err: string) => {
        notify.show(<Toast>{err}</Toast>, 'error');
      });
  };

  const isCurrentUser = currentUser.username === user.username;
  return (
    <div>
      <h2 className="text--medium">{user.name}</h2>
      <span className="color--gray">@{user.username}</span>
      <p>
        {isBioEditing ? (
          <Textarea
            as="textarea"
            onBlur={updateBio}
            style={{ resize: 'none' }}
            autoFocus={isBioEditing}
            rows={3}
          >
            {isCurrentUser ? currentUser.bio : user.bio}
          </Textarea>
        ) : isCurrentUser ? (
          currentUser.bio
        ) : (
          user.bio
        )}
      </p>
      {isCurrentUser && (
        <ButtonGroup>
          <Button
            isLoading={isBioLoading}
            style={{ margin: 0 }}
            onClick={toggleBioEdit}
            icon="edit"
            size="sm"
            variant="secondary"
          >
            Edit bio
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};


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

  const currentUser = useSelector((state: StoreState) => state.auth.user);
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

  const isCurrentUser = currentUser.username === user.username;

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
        <Flex align="center" direction="column">
          {isCurrentUser ? (
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
        </Flex>
        <Bio currentUser={currentUser} user={user} />
      </UserMetaInfo>
      <div>
        <StandOut prefix={totalComments || 0}>Comments</StandOut>
        <StandOut prefix={totalBugs || 0}>Bugs issued</StandOut>
        <StandOut prefix={'Joined'}>{getTimeDiff(user.date_joined)}</StandOut>
      </div>
    </UserInfoWrapper>
  );
};

export default UserInfo;
