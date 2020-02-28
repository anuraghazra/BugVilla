import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Dispatch } from 'redux';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'components/common/Toast';
import Loading from 'components/common/Loading';
import useQuery from 'hooks/useQuery';

import DashboardHeader from 'components/DashboardHeader';
import Comment from '../../components/Comment/Comment';
import Activity from './Activity';
import Reference from './Reference';
import MetaInfo from './MetaInfo';
import SingleBugWrapper from './SingleBug.style';
import SingleBugAside from './SingleBugAside';
import CommentEditorForm from './CommentEditorForm';

import { fetchBugWithId } from 'store/ducks/single-bug';
import { StoreState } from 'store';
import Illustration from 'components/common/Illustration';

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
  const query = useQuery();
  const dispatch = useDispatch<Dispatch>();
  const { bugId } = useParams<any>();

  const bug = useSelector((state: StoreState) => state.singlebug.bug);
  const [isFetching, fetchError] = useSelector((state: StoreState) => [
    state.loading['singlebug/FETCH_BUG'],
    state.error['singlebug/FETCH_BUG']
  ]);

  let query_comment_id = query.get('comment_id');
  useEffect(() => {
    dispatch(fetchBugWithId(bugId)).then(() => {
      // scroll to comment
      if (!query_comment_id) return;
      let comment: any = document?.getElementById(query_comment_id as string);
      comment && window.scrollTo(0, comment.offsetTop);
    });
  }, [bugId]);

  fetchError && toast.error(fetchError);

  return (
    <SingleBugWrapper>
      {isFetching && <Loading />}
      {fetchError && <Illustration type="error" />}
      {bug && (
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
            {bug?.comments.map((comment: any) => (
              <Comment
                bugId={bugId}
                commentId={comment.id}
                key={comment.id}
                body={comment.body}
                author={comment.author}
                date={comment.date}
                isSelected={query_comment_id === comment.id}
              />
            ))}
            {bug?.activities.map((activity: any, i: number) => (
              <Activity
                key={i}
                author={activity.author}
                action={activity.action}
                date={activity.date}
              />
            ))}
            {bug?.references.map(({ from, by, date }: any, i: number) => (
              <Reference key={i} from={from} by={by} date={date} />
            ))}
            <CommentEditorForm bugIsOpen={bug.isOpen} />
          </section>
          <section className="singlebug__aside">
            <SingleBugAside bugId={bugId} bug={bug} />
          </section>
        </>
      )}
    </SingleBugWrapper>
  );
};

export default SingleBug;
