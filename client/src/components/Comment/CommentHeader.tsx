import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import Twemoji from 'components/common/Twemoji';
import { toast } from 'components/common/Toast';
import { copyToClipboard, timeAgo } from 'utils';

import BaseDropdown from 'components/common/BaseDropdown';
import { AuthorProps } from 'pages/SingleBug/SingleBug';
import {
  addOrRemoveReacts,
  addOrRemoveReactsComment,
  COMMENT_REACTIONS_OPTI
} from 'store/ducks/single-bug';
import { StoreState } from 'store';
import { ReactionsWrapper, ReactionType, ReactionUser } from './Reactions';

const REACTIONS: { emoji: string }[] = [
  { emoji: ':+1:' },
  { emoji: ':-1:' },
  { emoji: ':heart:' },
  { emoji: ':tada:' },
  { emoji: ':smile:' },
  { emoji: ':confused:' }
];

interface CommentProps {
  bugId: number | string;
  author: AuthorProps;
  date: string;
  reactions: ReactionType[];
  commentId: string;
  isAuthorOfComment: boolean;
  handleEditorState: (e: any) => void;
}
const CommentHeader: React.FC<CommentProps> = ({
  bugId,
  author,
  date,
  commentId,
  reactions,
  isAuthorOfComment,
  handleEditorState
}) => {
  const dispatch = useDispatch();
  const currentUserId: any = useSelector(
    (state: StoreState) => state.auth.user.id
  );

  const copyCommentLink = () => {
    let fullPath = window.location.origin + window.location.pathname;
    let url = commentId ? `${fullPath}?comment_id=${commentId}` : fullPath;
    copyToClipboard(url);
    toast.success('Link copied!');
  };

  const handleReaction = (emoji: string) => {
    let optimisticData = {
      username: author.username,
      name: author.name,
      id: author.id
    };
    // if commentId is missing that means its a bug.body
    if (commentId === '') {
      dispatch(addOrRemoveReacts(bugId, emoji));
    } else {
      dispatch({
        type: COMMENT_REACTIONS_OPTI,
        payload: { commentId, optimisticData, emoji: emoji }
      });
      dispatch(addOrRemoveReactsComment(bugId, commentId, emoji));
    }
  };

  return (
    <Flex
      className="comment__header"
      nowrap
      align="center"
      justify="space-between"
    >
      <Avatar width="45px" height="45px" size={45} username={author.username} />
      <span className="color--gray ml-15">
        <Link className="text--medium" to={`/profiles/${author.username}`}>
          {author.name}{' '}
        </Link>
        commented {timeAgo(date)}
      </span>

      <Flex
        align="center"
        justify="space-between"
        nowrap
        className="comment__actions"
      >
        <BaseDropdown
          isOpen={false}
          shouldCloseOnClick
          trigger={toggle => (
            <Flex
              nowrap
              onClick={toggle}
              className="add-smile-icon hover__button"
            >
              <FontAwesomeIcon icon="smile" />
              <sup>
                <FontAwesomeIcon icon="plus" />
              </sup>
            </Flex>
          )}
        >
          <ReactionsWrapper
            align="center"
            justify="space-between"
            nowrap
            style={{ marginTop: 0 }}
          >
            {REACTIONS?.map(reaction => {
              let isSelected = reactions.some(
                r =>
                  r.emoji == reaction.emoji &&
                  r.users.find(u => u.id === currentUserId)
                // r.users.includes(currentUserId)
              );
              return (
                <span
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`reaction ${
                    isSelected ? 'reaction_selected' : ''
                  }`}
                >
                  <Twemoji emoji={reaction.emoji} className="reaction_emoji" />
                </span>
              );
            })}
          </ReactionsWrapper>
        </BaseDropdown>

        <BaseDropdown
          isOpen={false}
          shouldCloseOnClick
          trigger={toggle => (
            <span onClick={toggle} className="hover__button">
              <FontAwesomeIcon icon="ellipsis-v" />
            </span>
          )}
        >
          <Flex direction="column">
            <span onClick={copyCommentLink} className="hover__button">
              Copy link
            </span>
            {isAuthorOfComment && (
              <span onClick={handleEditorState} className="hover__button mt-5">
                Edit Comment
              </span>
            )}
          </Flex>
        </BaseDropdown>
      </Flex>
    </Flex>
  );
};

export default CommentHeader;
