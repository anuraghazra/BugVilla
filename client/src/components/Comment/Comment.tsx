import React, { useState, useCallback } from 'react';
import RM from 'react-markdown';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { getRefsOrMentions, renderMarkdown } from 'utils';
import {
  AuthorProps,
  addCommentSchema as CommentSchema
} from 'pages/SingleBug/SingleBug';

import Button, { ButtonGroup } from 'components/common/Button';
import { toast } from 'components/common/Toast';

import CodeBlock from 'components/Editor/CodeBlock';
import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import StyledComment from './Comment.style';

import {
  editComment,
  updateBug,
  addReferences,
  mentionPeople
} from 'store/ducks/single-bug';
import { StoreState } from 'store';
import CommentHeader from './CommentHeader';
import Reactions from './Reactions';

const ReactMarkdown = React.memo(RM);
const MarkdownPlugins = {
  code: CodeBlock
};

interface CommentProps {
  author: AuthorProps;
  date: string;
  body: string;
  bugId: number | string;
  commentId: string;
  isSelected?: boolean;
  reactions?: any;
}
const Comment: React.FC<CommentProps> = ({
  author,
  date,
  body,
  bugId,
  commentId,
  isSelected,
  reactions
}) => {
  const dispatch = useDispatch<any>();
  const userId = useSelector((state: StoreState) => state.auth.user.id);
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
  const [
    isEditingPending,
    editingError
  ] = useSelector(({ loading, error }: StoreState) => [
    loading['singlebug/EDIT_COMMENT'] || loading['singlebug/UPDATE_BUG'],
    error['singlebug/EDIT_COMMENT'] || error['singlebug/UPDATE_BUG']
  ]);

  const handleEditorState = useCallback(
    (e: any) => {
      e.preventDefault();
      setValue('body', '');
      setIsEditing(!isEditing);
    },
    [isEditing]
  );

  const onSubmit = (formData: any) => {
    if (commentId === '') {
      // update the bug's body
      dispatch(updateBug(bugId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    } else {
      // update the comment
      dispatch(editComment(bugId, commentId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    }

    const references = getRefsOrMentions(markdown, '#');
    const mentions = getRefsOrMentions(markdown, '@');

    references.length && dispatch(addReferences(bugId, references));
    mentions.length && dispatch(mentionPeople(bugId, mentions));
  };

  const isAuthorOfComment = userId === author.id;
  const showCommentEditor = isEditing && isAuthorOfComment;

  editingError && toast.error(editingError);
  return (
    <StyledComment
      id={commentId}
      isSelected={isSelected}
      style={{ padding: showCommentEditor ? 0 : 20 }}
    >
      {showCommentEditor ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledEditor>
            <Editor
              markdown={markdown}
              handleMarkdown={handleMarkdown}
              errors={formErrors}
              inputRef={register}
            />
            <ButtonGroup float="right">
              <Button
                variant="danger"
                icon="times"
                size="sm"
                onClick={handleEditorState}
              >
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
          <CommentHeader
            bugId={bugId}
            date={date}
            author={author}
            reactions={reactions}
            commentId={commentId}
            handleEditorState={handleEditorState}
            isAuthorOfComment={isAuthorOfComment}
          />

          <ReactMarkdown
            renderers={MarkdownPlugins}
            className="markdown-preview"
            source={renderMarkdown(body)}
          />
          <Reactions reactions={reactions} />
        </>
      )}
    </StyledComment>
  );
};

export default React.memo(Comment);
