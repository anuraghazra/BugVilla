import React, { useState } from 'react';

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
import Button from 'components/common/Button';
import http from 'utils/httpInstance';
import { useForm } from 'react-hook-form';
import Toast from 'components/common/Toast';
import * as yup from 'yup';


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
`;

export interface AuthorProps {
  name: string;
  username: string;
}

const SingleBug: React.FC = () => {
  const { bugId } = useParams();
  const { data, isLoading, error } = useFetch(`/api/bugs/${bugId}`);
  const [isCommentLoading, setIsCommentloading] = useState(false);
  const [commentError, setCommentError] = useState<any>(null);
  const { register, handleSubmit, formErrors }: any = useForm({
    validationSchema: addCommentSchema
  });

  const onSubmit = async (data: { body: string }) => {
    setIsCommentloading(true);
    setCommentError(null);
    try {
      await http({
        method: 'PATCH',
        url: `api/bugs/${bugId}/comments`,
        data
      });
      setIsCommentloading(false);
      // history.push('/dashboard/bugs');
    } catch (err) {
      setCommentError(err.response.data.error);
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
                  body={comment.body}
                  author={comment.author}
                  date={comment.date}
                />
              ))}
            {bug.activities.length > 0 &&
              bug.activities.map((activity: any) => (
                <Activity
                  author={activity.author}
                  action={activity.action}
                  date={activity.date}
                />
              ))}
            <form onSubmit={handleSubmit(onSubmit)}>
              <StyledEditor>
                <Editor
                  errors={formErrors}
                  inputRef={register({ required: 'Body is required' })}
                />

                <Button
                  isLoading={isCommentLoading}
                  type="submit"
                  className="bug__button"
                  icon="plus"
                >
                  Submit
                </Button>
              </StyledEditor>
            </form>
          </DashboardHeader>
        </>
      )}
    </SingleBugWrapper>
  );
};

export default SingleBug;
