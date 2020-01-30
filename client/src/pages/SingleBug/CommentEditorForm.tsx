import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Button, { ButtonGroup } from 'components/common/Button';
import Toast from 'components/common/Toast';

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
  const [references, setReferences] = useState<number[]>([]);

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

  const onMentionBug = (id: number) => {
    if (references.indexOf(id) === -1) {
      setReferences([...references, id]);
    }
  };

  const onSubmit = (formData: { body: string }) => {
    dispatch(addComment(bugId, formData)).then(() => {
      dispatch(addReferences(bugId, references));
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

  return (
    <>
      <Toast isVisible={!!commentError} message={commentError} />
      <Toast isVisible={!!toggleError} message={toggleError} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledEditor>
          <Editor
            markdown={markdown}
            onMentionBug={onMentionBug}
            handleMarkdown={handleMarkdown}
            errors={formErrors}
            inputRef={register}
          />
          <ButtonGroup className="bug__button">
            <CloseReopenButton
              isOpen={bugIsOpen}
              isLoading={isToggleLoading}
              handleRequst={sendToggleRequest}
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
