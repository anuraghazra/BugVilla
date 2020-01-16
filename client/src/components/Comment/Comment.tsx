import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getTimeDiff } from 'utils';
import { AuthorProps, addCommentSchema as CommentSchema } from '../../pages/SingleBug/SingleBug';

import Flex from 'components/common/Flex';
import Button, { ButtonGroup } from 'components/common/Button';
import Toast from 'components/common/Toast';

import Avatar from 'components/Avatar/Avatar';
import CodeBlock from 'components/Editor/CodeBlock';
import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import StyledComment from './Comment.style';
import { editComment, updateBug } from 'store/ducks/single-bug';
import MentionPlugin from 'components/Editor/MentionPlugin';

interface CommentProps {
  author: AuthorProps;
  date: string;
  body: string;
  bugId: number | string;
  commentId: string;
}

const Comment: React.FC<CommentProps> = ({
  author,
  date,
  body,
  bugId,
  commentId
}) => {
  const dispatch = useDispatch<any>();
  const userId = useSelector((state: any) => state.auth.user.id);
  const [isEditing, setIsEditing] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    errors: formErrors
  }: any = useForm({
    validationSchema: CommentSchema
  });
  const markdown = watch('body', body);
  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  // using || to get the states of both comment editing & bug updating
  const [isEditingPending, editingError] = useSelector((state: any) => [
    state.loading['singlebug/EDIT_COMMENT'] ||
      state.loading['singlebug/UPDATE_BUG'],
    state.error['singlebug/EDIT_COMMENT'] || state.error['singlebug/UPDATE_BUG']
  ]);

  const handleEditorState = (e: any) => {
    e.preventDefault();
    setValue('body', '');
    setIsEditing(!isEditing);
  };

  const onSubmit = (formData: any) => {
    if (commentId === '') {
      // it's no the comment!
      dispatch(updateBug(bugId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    } else {
      dispatch(editComment(bugId, commentId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    }
  };

  const isAuthorOfComment = userId === author.id;
  const showCommentEditor = isEditing && isAuthorOfComment;

  return (
    <StyledComment style={{ padding: showCommentEditor ? 0 : 20 }}>
      {/* <Toast isVisible={!!editingError} message={editingError} /> */}

      {showCommentEditor ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledEditor>
            <Editor
              markdown={markdown}
              handleMarkdown={handleMarkdown}
              errors={formErrors}
              inputRef={register}
            />
            <ButtonGroup style={{ float: 'right' }}>
              <Button danger icon="times" size="sm" onClick={handleEditorState}>
                Cancel
              </Button>
              <Button
                icon="edit"
                size="sm"
                type="submit"
                isLoading={isEditingPending}
              >
                Update
              </Button>
            </ButtonGroup>
          </StyledEditor>
        </form>
      ) : (
        <>
          <Flex className="comment__header" nowrap align="center">
            <Avatar
              width="45px"
              height="45px"
              src={`/api/user/${author.username}/avatar/raw?size=45`}
            />
            <span className="color--gray ml-15">
              <a className="text--medium" href={`/users/${author.username}`}>
                {author.name}{' '}
              </a>
              commented {getTimeDiff(date)}
            </span>
            {isAuthorOfComment && (
              <span
                onClick={handleEditorState}
                style={{ marginLeft: 'auto' }}
                className="hover__button color--gray ml-15"
              >
                <FontAwesomeIcon icon="ellipsis-v" />
              </span>
            )}
          </Flex>
          <ReactMarkdown
            renderers={{ code: CodeBlock, text: MentionPlugin }}
            className="markdown-preview"
            source={markdown}
          />
        </>
      )}
    </StyledComment>
  );
};

export default React.memo(Comment);
