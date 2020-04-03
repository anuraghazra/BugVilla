import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast, Button, ButtonGroup, Flex, CircleIcon, Tooltip } from '@bug-ui';
import { Textarea } from '@bug-ui/Form';

import { StoreState } from 'store';
import { updateUserBio } from 'store/ducks/auth';

interface BioProps {
  user: any;
  currentUser: any;
}
const Bio: React.FC<BioProps> = ({ user, currentUser }) => {
  const dispatch = useDispatch<any>();
  const textareaRef = useRef<any>();
  const isBioLoading = useSelector(
    (state: StoreState) => state.loading['user/UPDATE_BIO']
  );

  const [isSaveButton, setIsSaveButton] = useState(false);
  const [isBioEditing, setBioEditing] = useState(false);
  const toggleBioEdit = () => {
    setBioEditing(() => {
      console.log(textareaRef.current.focus());
      return !isBioEditing;
    });
  };

  const updateBio = () => {
    setBioEditing(false);
    dispatch(updateUserBio({ bio: textareaRef.current.value }))
      .then(() => {
        toast.success('Bio updated');
      })
      .catch((err: string) => {
        toast.error(err);
      });
  };

  const isCurrentUser = currentUser.username === user.username;

  useEffect(() => {
    const findButton = (e: any) => {
      setIsSaveButton(e.target && e.target.closest('.edit__button'));
    };
    document.body.addEventListener('mousedown', findButton);

    return () => document.body.removeEventListener('mousedown', findButton);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Flex
        style={{ display: 'inline-flex' }}
        as="h2"
        align="center"
        gap="small"
        className="text--medium"
      >
        <span>{user.name}</span>
        <CircleIcon
          as="span"
          size="25px"
          variant={user.isVerified ? 'success' : 'danger'}
          icon={user.isVerified ? 'check' : 'times'}
        />
      </Flex>
      <br />
      <span className="color--gray">@{user.username}</span>
      <p>
        <Textarea
          rows={3}
          as="textarea"
          ref={textareaRef}
          className={
            isBioEditing ? 'bio__textarea--show' : 'bio__textarea--hidden'
          }
          onBlur={() => !isSaveButton && setBioEditing(false)}
        >
          {currentUser.bio}
        </Textarea>
        {!isBioEditing && (isCurrentUser ? currentUser.bio : user.bio)}
      </p>
      {isCurrentUser && (
        <ButtonGroup gap="medium">
          <Button
            className="edit__button"
            size="small"
            icon="edit"
            onClick={isBioEditing ? updateBio : toggleBioEdit}
            variant={isBioEditing ? 'success' : 'secondary'}
            isLoading={isBioLoading}
            style={{ marginTop: 0 }}
          >
            Edit bio
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};

export default Bio;
