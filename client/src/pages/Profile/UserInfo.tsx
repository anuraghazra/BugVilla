import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

import { timeAgo, calculateReputation } from 'utils';
import {
  Avatar,
  Button,
  ButtonGroup,
  CircleIcon,
  Flex,
  Grid,
  toast
} from '@bug-ui';

import { StoreState } from 'store';
import { updateUserAvatar } from 'store/ducks/auth';
import { UserMetaInfo } from './UserInfo.style';
import AvatarFileUploader from 'components/AvatarFileUploader';
import Bio from './Bio';
import Reactions, { ReactionType } from 'components/Comment/Reactions';
import useFetch from 'hooks/useFetch';

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
    color: ${p => p.theme.colors.primary};
    font-family: ${p => p.theme.font.primaryMedium};
  }
`;

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
  const [reactions] = useFetch(`/api/user/${user.username}/reactions/count`);

  const [isUploadPending] = useSelector((state: StoreState) => [
    state.loading['user/UPLOAD_AVATAR']
  ]);

  const onSubmit = () => {
    const formData = new FormData();
    file && formData.append('image', file);
    dispatch(updateUserAvatar(formData))
      .then(() => {
        setIsOpen(false);
        toast.success('Profile picture updated');
      })
      .catch((err: any) => {
        setIsOpen(false);
        setFile(undefined);
        toast.error(err);
      });
  };

  const isCurrentUser = currentUser.username === user.username;

  const reputation: number = calculateReputation(reactions?.data);
  return (
    <Grid columns={{ desktop: `1fr 1fr`, tablet: '1fr' }} gap="xlarge">
      <Modal
        closeTimeoutMS={300}
        isOpen={modalIsOpen}
        style={customStyles}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>
          <Flex align="center">
            <CircleIcon className="mr-medium" icon="check" />
            Confirmation
          </Flex>
        </h2>
        <p>Are you sure you want to change your Profile Picture?</p>
        <br />
        <ButtonGroup gap="medium">
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
        <Grid columns={{ desktop: `150px 1fr`, tablet: '1fr' }} gap="xlarge">
          <Flex
            align="center"
            direction="column"
            className="usermetainfo__avatar"
          >
            {isCurrentUser ? (
              <AvatarFileUploader
                size="150px"
                name="image"
                file={file}
                defaultImg={`/api/user/${user.username}/avatar/raw?size=${150}`}
                handleFile={file => {
                  setIsOpen(true);
                  setFile(file);
                }}
              />
            ) : (
              <Avatar size={150} username={user.username} />
            )}
          </Flex>
          <Bio currentUser={currentUser} user={user} />
        </Grid>
      </UserMetaInfo>
      <div>
        <StandOut prefix={'Reputation'}>{reputation}%</StandOut>
        <StandOut prefix={totalComments || 0}>Comments</StandOut>
        <StandOut prefix={totalBugs || 0}>Bugs issued</StandOut>
        <StandOut prefix={'Joined'}>{timeAgo(user.date_joined)}</StandOut>
      </div>

      <div>
        <small className="color--gray">
          Reactions given to {user.username}
        </small>
        <br />
        <small className="color--gray"></small>
        <br />
        {reactions?.data && <Reactions reactions={reactions.data} />}
      </div>
    </Grid>
  );
};

export default UserInfo;
