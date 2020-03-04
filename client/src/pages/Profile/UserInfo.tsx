import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

import { timeAgo } from 'utils';
import Avatar from 'components/common/Avatar';
import Button, { ButtonGroup } from 'components/common/Button';
import CircleIcon from 'components/common/CircleIcon';
import Flex from 'components/common/Flex';
import { toast } from 'components/common/Toast';

import { StoreState } from 'store';
import { updateUserAvatar } from 'store/ducks/auth';
import { UserInfoWrapper, UserMetaInfo } from './UserInfo.style';
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
    color: ${p => p.theme.colors.brand.primary};
    font-family: ${p => p.theme.font.primaryMedium};
  }
`;

interface UserInfoProps {
  user: any;
  totalComments: string | number;
  totalBugs: string | number;
}

const calculateReputation = (reactions: ReactionType[]) => {
  const REPUTATION_MAP: any = {
    ':+1:': 30,
    ':-1:': -20,
    ':smile:': 20,
    ':heart:': 30,
    ':confused:': -10,
    ':tada:': 20
  };

  let avg = 0;
  reactions?.forEach((react, index) => {
    avg += REPUTATION_MAP[react.emoji] * react.users.length;
  });

  return avg / 5 || 0;
};

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
    <UserInfoWrapper>
      <Modal
        closeTimeoutMS={300}
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
        {reactions?.data && <Reactions reactions={reactions.data} />}
      </div>
    </UserInfoWrapper>
  );
};

export default UserInfo;
