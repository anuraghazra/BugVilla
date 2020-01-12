import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Dropdown from 'react-dropdown';

import Flex from 'components/common/Flex';
import Toast from 'components/common/Toast';
import Loading from 'components/common/Loading';
import Label, { BulletLabel } from 'components/common/Label';
import Button, { ButtonGroup } from 'components/common/Button';

import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import DashboardHeader from 'components/DashboardHeader';

import Comment from './Comment';
import Activity from './Activity';
import MetaInfo from './MetaInfo';
import CloseReopenButton from './CloseReopenButton';
import Avatar from 'components/Avatar/Avatar';
import SingleBugWrapper from './SingleBug.style';

import {
  fetchBugWithId,
  addComment,
  openOrCloseBug
} from 'store/ducks/single-bug';

const addCommentSchema = yup.object().shape({
  body: yup
    .string()
    .min(6)
    .max(1000)
    .required()
});

// get unique avatar images from all comments
const getParticipants = (bug: any): string[] => {
  if (bug && bug.comments) {
    return bug.comments
      .map((c: any) => `/api/user/${c.author.username}/avatar/raw?size=45`)
      .filter(
        (item: string, pos: number, array: string[]) =>
          array.indexOf(item) === pos
      );
  }
  return [];
};

export interface AuthorProps {
  name: string;
  username: string;
}

const SingleBug: React.FC = () => {
  const dispatch = useDispatch();
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

  const onSubmit = async (formData: { body: string }) => {
    dispatch(addComment(bugId, formData));
    setValue('body', '');
  };
  const sendToggleRequest = (state: string) => {
    dispatch(openOrCloseBug(bugId, state));
  };

  useEffect(() => {
    dispatch(fetchBugWithId(bugId));
  }, [bugId]);

  let participants: string[] = getParticipants(bug);

  return (
    <SingleBugWrapper>
      <Toast isVisible={!!commentError} message={commentError} />
      <Toast isVisible={!!toggleError} message={toggleError} />
      <Toast isVisible={!!fetchError} message={fetchError} />
      
      {isFetching && <Loading />}
      {fetchError && <p>Something went wrong while fetching the data</p>}
      <section>
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
          </>
        )}
      </section>
      <section className="singlebug__aside">
        <div>
          {/* <h4 className="label__header color--gray">
            Labels{' '}
            <FontAwesomeIcon onClick={openDropdown} size="sm" icon="cog" />
            {isDropdownOpen && (
              <div className="label__dropdown">
                <Dropdown
                  options={selectLabels}
                  renderItem={(value: any) => (
                    <>
                      <div></div>
                      <BulletLabel type={value}>{value}</BulletLabel>
                    </>
                  )}
                />
              </div>
            )}
          </h4> */}
          <Flex>
            {bug &&
              bug.labels.length > 0 &&
              bug.labels.map((label: any, i: number) => (
                <Label type={label.name} key={i}>
                  {label.name}
                </Label>
              ))}
          </Flex>
        </div>
        <div>
          <h4 className="color--gray">{participants.length} participants</h4>
          <Flex>
            {participants.map((participant: any, i: number) => (
              <Avatar key={i} width="40px" height="40px" src={participant} />
            ))}
          </Flex>
        </div>
      </section>
    </SingleBugWrapper>
  );
};

export default SingleBug;
