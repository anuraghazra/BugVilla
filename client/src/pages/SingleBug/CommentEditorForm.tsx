import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm, FormContextValues } from 'react-hook-form';

import { getRefsOrMentions } from 'utils';
import { Button, ButtonGroup, toast } from '@bug-ui';

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

const CommentEditorForm: React.FC<{ bugIsOpen: boolean }> = ({ bugIsOpen }) => {
  const dispatch = useDispatch<any>();
  const { bugId } = useParams<any>();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    errors: formErrors
  }: FormContextValues<Record<string, any>> = useForm({
    validationSchema: addCommentSchema
  });

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

  const [isCommentLoading, commentError] = useSelector((state: StoreState) => [
    state.loading['singlebug/ADD_COMMENT'],
    state.error['singlebug/ADD_COMMENT']
  ]);
  const [isToggleLoading, toggleError] = useSelector((state: StoreState) => [
    state.loading['singlebug/TOGGLE_BUG'],
    state.error['singlebug/TOGGLE_BUG']
  ]);

  commentError && toast.error(commentError);
  toggleError && toast.error(toggleError);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <StyledEditor>
          <Editor
            markdown={markdown}
            handleMarkdown={handleMarkdown}
            errors={formErrors}
            inputRef={register}
          />
          <ButtonGroup gap="medium">
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

export default React.memo(CommentEditorForm);
