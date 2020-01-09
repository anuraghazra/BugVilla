import React, { useState } from 'react';
import * as yup from 'yup';

import DashboardHeader from 'components/DashboardHeader';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import useFetch from 'hooks/useFetch';

import Loading from 'components/common/Loading';
import MetaInfo from './MetaInfo';
import Comment from './Comment';
import Activity from './Activity';
import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import Button, { ButtonGroup } from 'components/common/Button';
import http from 'utils/httpInstance';
import { useForm } from 'react-hook-form';
import Toast from 'components/common/Toast';

const addCommentSchema = yup.object().shape({
  body: yup
    .string()
    .min(6)
    .max(1000)
    .required()
});

const CloseReopenButton = ({
  handleRequst,
  isOpen
}: {
  handleRequst: any;
  isOpen: boolean;
}) => (
  <Button
    danger={isOpen}
    success={!isOpen}
    icon={isOpen ? 'times' : 'history'}
    onClick={(e: any) => {
      e.preventDefault();
      handleRequst(isOpen ? 'close' : 'open');
    }}
  >
    {isOpen ? 'Close' : 'Reopen'}
  </Button>
);

const SingleBugWrapper = styled.section`
  width: 100%;
  overflow: hidden;
  margin-bottom: 40px;
  position: relative;

  .bug__button {
    float: right;
    margin-bottom: 0;
  }
`;

export interface AuthorProps {
  name: string;
  username: string;
}

const SingleBug: React.FC = () => {
  const { bugId } = useParams();
  const { data, setData, isLoading, error } = useFetch(`/api/bugs/${bugId}`);
  const [isCommentLoading, setIsCommentloading] = useState(false);
  const [commentError, setCommentError] = useState<any>(null);

  const {
    register,
    handleSubmit,
    errors: formErrors,
    watch,
    reset
  }: any = useForm({
    validationSchema: addCommentSchema
  });
  // get the value of body to pass into <Editor />
  const markdown = watch('body');

  const onSubmit = async (formData: { body: string }) => {
    setIsCommentloading(true);
    setCommentError(null);
    try {
      let res = await http.patch(`api/bugs/${bugId}/comments`, formData);
      let stateData: any = { ...data };
      stateData.data.comments = res.data.data;
      setData(stateData);
      reset();
      setIsCommentloading(false);
    } catch (err) {
      setCommentError(err.response.data.error);
      console.log(commentError);
      setIsCommentloading(false);
    }
  };

  const sendCloseOpenRequest = async (state: string) => {
    setIsCommentloading(true);
    setCommentError(null);
    try {
      console.log(state);
      let res = await http.patch(`api/bugs/${bugId}/${state}`);
      let stateData: any = { ...data };
      stateData.data.activities = res.data.data;
      stateData.data.isOpen = state === 'open' ? true : false;
      setData(stateData);
      setIsCommentloading(false);
    } catch (err) {
      setCommentError(err.response.data.error);
      console.log(commentError);
      setIsCommentloading(false);
    }
  };

  let bug = data && data.data;
  return (
    <SingleBugWrapper>
      <Toast isVisible={!!commentError} message={commentError} />

      {isLoading && <Loading />}
      {error && <p>Something went wrong while fetching the data</p>}
      {bug && (
        <>
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
            <Comment
              body={bug.body}
              author={bug.author}
              date={bug.date_opened}
            />

            {bug.comments.length > 0 &&
              bug.comments.map((comment: any) => (
                <Comment
                  key={comment.id}
                  body={comment.body}
                  author={comment.author}
                  date={comment.date}
                />
              ))}
            {bug.activities.length > 0 &&
              bug.activities.map((activity: any) => (
                <Activity
                  key={activity.id}
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
                    handleRequst={sendCloseOpenRequest}
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
          </DashboardHeader>
        </>
      )}
    </SingleBugWrapper>
  );
};

export default SingleBug;
