import React from 'react';
import { Link } from 'react-router-dom';
import { Twemoji } from 'react-emoji-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Avatar from 'components/common/Avatar';
import { toast } from 'components/common/Toast';
import Flex from 'components/common/Flex';
import { copyToClipboard, timeAgo } from 'utils';

import BaseDropdown from 'components/common/BaseDropdown';
import { AuthorProps } from 'pages/SingleBug/SingleBug';
import { useDispatch } from 'react-redux';
import {
  addOrRemoveReacts,
  addOrRemoveReactsComment
} from 'store/ducks/single-bug';

const REACTIONS = [
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
  commentId: string;
  isAuthorOfComment: boolean;
  handleEditorState: (e: any) => void;
}
const CommentHeader: React.FC<CommentProps> = ({
  bugId,
  author,
  date,
  commentId,
  isAuthorOfComment,
  handleEditorState
}) => {
  const dispatch = useDispatch();

  const copyCommentLink = () => {
    let fullPath = window.location.origin + window.location.pathname;
    let url = commentId ? `${fullPath}?comment_id=${commentId}` : fullPath;
    copyToClipboard(url);
    toast.success('Link copied!');
  };

  const handleReaction = (emoji: string) => {
    // if commentId is missing that means its a bug.body
    if (commentId === '') {
      dispatch(addOrRemoveReacts(bugId, emoji));
    } else {
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
          <Flex
            align="center"
            justify="space-between"
            nowrap
            className="comment__reactions"
            style={{ marginTop: 0 }}
          >
            {REACTIONS?.map((reaction: any) => (
              <span
                onClick={() => handleReaction(reaction.emoji)}
                className="reaction"
              >
                <Twemoji svg text={reaction.emoji} className="reaction_emoji" />
              </span>
            ))}
          </Flex>
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
