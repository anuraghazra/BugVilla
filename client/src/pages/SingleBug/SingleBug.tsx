import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Dispatch } from 'redux';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';

import DashboardHeader from 'components/DashboardHeader';
import Comment from '../../components/Comment/Comment';
import Activity from './Activity';
import MetaInfo from './MetaInfo';
import SingleBugWrapper from './SingleBug.style';
import SingleBugAside from './SingleBugAside';
import CommentEditorForm from './CommentEditorForm';

import { fetchBugWithId } from 'store/ducks/single-bug';
import { StoreState } from 'store';

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
  const dispatch = useDispatch<Dispatch>();
  const { bugId } = useParams<any>();

  const bug = useSelector((state: StoreState) => state.singlebug.bug);
  const [isFetching, fetchError] = useSelector((state: StoreState) => [
    state.loading['singlebug/FETCH_BUG'],
    state.error['singlebug/FETCH_BUG']
  ]);

  useEffect(() => {
    dispatch(fetchBugWithId(bugId));
  }, [bugId]);

  return (
    <SingleBugWrapper>
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
                commentsCount={bug?.comments?.length}
              />
            </DashboardHeader>
            <Comment
              bugId={bugId}
              commentId={''} // assumes it's not a comment
              body={bug.body}
              author={bug.author}
              date={bug.date_opened}
            />
            {bug.comments &&
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
            {bug.activities &&
              bug.activities.map((activity: any, i: number) => (
                <Activity
                  key={i}
                  author={activity.author}
                  action={activity.action}
                  date={activity.date}
                />
              ))}
            <CommentEditorForm bugIsOpen={bug.isOpen} />
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
