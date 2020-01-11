import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';

import http from 'utils/httpInstance';
import useFetch from 'hooks/useFetch';

import Button, { ButtonGroup } from 'components/common/Button';
import Loading from 'components/common/Loading';
import Toast from 'components/common/Toast';

import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import DashboardHeader from 'components/DashboardHeader';

import Comment from './Comment';
import Activity from './Activity';
import MetaInfo from './MetaInfo';
import CloseReopenButton from './CloseReopenButton';
import useAPI from 'hooks/useAPI';

const addCommentSchema = yup.object().shape({
  body: yup
    .string()
    .min(6)
    .max(1000)
    .required()
});

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
  const { data: bugData, setData: setBug, isLoading, error } = useFetch(
    `/api/bugs/${bugId}`
  );
  const {
    register,
    handleSubmit,
    errors: formErrors,
    watch,
    setValue
  }: any = useForm({ validationSchema: addCommentSchema });
  // get the value of body to pass into <Editor />
  const markdown = watch('body');

  // don't wanna put this state in redux
  // for reasons unknown :D

  // commenting
  const {
    loading: isCommentLoading,
    error: commentError,
    callAPI: callCommentAPI
  } = useAPI();
  // open/close
  const {
    loading: isToggleLoading,
    error: toggleError,
    callAPI: callToggleAPI
  } = useAPI();

  // add comment
  const onSubmit = async (formData: any) => {
    callCommentAPI(
      {
        method: 'PATCH',
        url: `/api/bugs/${bugId}/comments`,
        data: formData
      },
      (res: any) => {
        let newData: any = { ...bugData };
        newData.data.comments = res.data.data;
        setBug(newData);
        setValue('body', '');
      }
    );
  };

  // send open/close request
  const sendToggleRequest = async (state: string) => {
    callToggleAPI(
      { method: 'PATCH', url: `/api/bugs/${bugId}/${state}` },
      (res: any) => {
        let newData: any = { ...bugData };
        newData.data.activities = res.data.data;
        newData.data.isOpen = state === 'open' ? true : false;
        setBug(newData);
      }
    );
  };

  let bug = bugData && bugData.data;
  return (
    <SingleBugWrapper>
      <Toast isVisible={!!commentError} message={commentError} />
      <Toast isVisible={!!toggleError} message={toggleError} />

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
          </DashboardHeader>

          <Comment body={bug.body} author={bug.author} date={bug.date_opened} />

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
                <Button isLoading={isCommentLoading} type="submit" icon="plus">
                  Comment
                </Button>
              </ButtonGroup>
            </StyledEditor>
          </form>
        </>
      )}
    </SingleBugWrapper>
  );
};

export default SingleBug;
