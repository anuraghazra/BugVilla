import React, { useEffect, useCallback } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';
import Button, { ButtonGroup } from 'components/common/Button';

import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import DashboardHeader from 'components/DashboardHeader';

import Comment from './Comment';
import Activity from './Activity';
import MetaInfo from './MetaInfo';
import CloseReopenButton from './CloseReopenButton';
import SingleBugWrapper from './SingleBug.style';

import {
  fetchBugWithId,
  addComment,
  openOrCloseBug
} from 'store/ducks/single-bug';
import SingleBugAside from './SingleBugAside';

export const addCommentSchema = yup.object().shape({
  body: yup
    .string()
    .min(6)
    .max(1000)
    .required()
});

export interface AuthorProps {
  name: string;
  username: string;
  id?: string;
}

const SingleBug: React.FC = () => {
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

  const bug = useSelector((state: any) => state.singlebug.bug);
  const {
    loading: {
      'singlebug/FETCH_BUG': isFetching,
      'singlebug/ADD_COMMENT': isCommentLoading,
      'singlebug/TOGGLE_BUG': isToggleLoading
    },
    error: {
      'singlebug/FETCH_BUG': fetchError,
      'singlebug/ADD_COMMENT': commentError,
      'singlebug/TOGGLE_BUG': toggleError
    }
  } = useSelector((state: any) => {
    return {
      loading: state.loading,
      error: state.error
    };
  });

  const onSubmit = useCallback(
    async (formData: { body: string }) => {
      dispatch(addComment(bugId, formData));
      setValue('body', '');
    },
    [dispatch]
  );
  const sendToggleRequest = useCallback(
    (state: string) => {
      dispatch(openOrCloseBug(bugId, state));
    },
    [bugId]
  );
  useEffect(() => {
    dispatch(fetchBugWithId(bugId));
  }, [bugId]);

  return (
    <SingleBugWrapper>
      <Toast isVisible={!!commentError} message={commentError} />
      <Toast isVisible={!!toggleError} message={toggleError} />
      <Toast isVisible={!!fetchError} message={fetchError} />

      {isFetching && <Loading />}
      {fetchError && <p>Something went wrong while fetching the data</p>}
      {bug ? (
        <>
          <section>
            <DashboardHeader>
              <h1>
                {bug.title} <span className="color--gray">#{bugId}</span>
              </h1>
              <MetaInfo
                isOpen={bug.isOpen}
                date={bug.date_opened}
                author={bug.author}
                commentsCount={bug.comments.length}
              />
            </DashboardHeader>

            <Comment
              bugId={bugId}
              commentId={''} // assumes it's not a comment
              body={bug.body}
              author={bug.author}
              date={bug.date_opened}
            />
            {bug.comments.length > 0 &&
              bug.comments.map((comment: any) => (
                <Comment
                  bugId={bugId}
                  commentId={comment.id}
                  key={comment.id}
                  body={comment.body}
                  author={comment.author}
                  date={comment.date}
                />
              ))}
            {bug.activities.length > 0 &&
              bug.activities.map((activity: any, i: number) => (
                <Activity
                  key={i}
                  author={activity.author}
                  action={activity.action}
                  date={activity.date}
                />
              ))}
            <form onSubmit={handleSubmit(onSubmit)}>
              <StyledEditor>
                <Editor
                  markdown={markdown}
                  errors={formErrors}
                  inputRef={register({ required: 'Body is required' })}
                />
                <ButtonGroup className="bug__button">
                  <CloseReopenButton
                    isOpen={bug.isOpen}
                    isLoading={isToggleLoading}
                    handleRequst={sendToggleRequest}
                  />
                  <Button
                    isLoading={isCommentLoading}
                    type="submit"
                    icon="plus"
                  >
                    Comment
                  </Button>
                </ButtonGroup>
              </StyledEditor>
            </form>
          </section>
          <section className="singlebug__aside">
            <SingleBugAside bugId={bugId} bug={bug} />
          </section>
        </>
      ) : null}
    </SingleBugWrapper>
  );
};

export default SingleBug;
