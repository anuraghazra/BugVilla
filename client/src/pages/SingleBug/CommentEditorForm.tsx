import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getRefsOrMentions } from 'utils';
import Button, { ButtonGroup } from 'components/common/Button';

import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import CloseReopenButton from './CloseReopenButton';
import { addCommentSchema } from './SingleBug';
import {
  addComment,
  openOrCloseBug,
  addReferences
} from 'store/ducks/single-bug';
import { StoreState } from 'store';
import { toast } from 'components/common/Toast';

const CommentEditorForm: React.FC<{ bugIsOpen: boolean }> = ({ bugIsOpen }) => {
  const dispatch = useDispatch<any>();
  const { bugId } = useParams<any>();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    errors: formErrors
  }: any = useForm({ validationSchema: addCommentSchema });

  const markdown = watch('body');
  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  const onSubmit = (formData: { body: string }) => {
    dispatch(addComment(bugId, formData)).then(() => {
      const references = getRefsOrMentions(markdown, '#');
      references.length && dispatch(addReferences(bugId, references));
      setValue('body', '');
    });
  };

  const sendToggleRequest = useCallback(
    (state: string) => {
      dispatch(openOrCloseBug(bugId, state));
    },
    [bugId]
  );

  const {
    loading: {
      'singlebug/ADD_COMMENT': isCommentLoading,
      'singlebug/TOGGLE_BUG': isToggleLoading
    },
    error: {
      'singlebug/ADD_COMMENT': commentError,
      'singlebug/TOGGLE_BUG': toggleError
    }
  } = useSelector((state: StoreState) => ({
    loading: state.loading,
    error: state.error
  }));

  commentError && toast.error(commentError);
  toggleError && toast.error(toggleError);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledEditor>
          <Editor
            markdown={markdown}
            handleMarkdown={handleMarkdown}
            errors={formErrors}
            inputRef={register}
          />
          <ButtonGroup className="bug__button">
            <CloseReopenButton
              isOpen={bugIsOpen}
              isLoading={isToggleLoading}
              onRequestToggle={sendToggleRequest}
            />
            <Button isLoading={isCommentLoading} type="submit" icon="plus">
              Comment
            </Button>
          </ButtonGroup>
        </StyledEditor>
      </form>
    </>
  );
};

export default CommentEditorForm;
