import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import { getTimeDiff } from 'utils';
import { AuthorProps } from './SingleBug';

import Flex from 'components/common/Flex';
import Avatar from 'components/Avatar/Avatar';
import CodeBlock from 'components/Editor/CodeBlock';

const StyledComment = styled.div`
  padding: 20px;
  border: 1px solid ${p => p.theme.colors.common.offwhite};
  border-radius: 10px;
  margin-top: ${p => p.theme.spacings.top}px;
  margin-bottom: ${p => p.theme.spacings.bottom}px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 15px;
    bottom: -${p => p.theme.spacings.bottom + 1}px;
    width: 2px;
    height: ${p => p.theme.spacings.bottom}px;
    background-color: ${p => p.theme.colors.common.offwhite};
  }
  .comment__header,
  a {
    font-size: 14px;
  }

  .comment__header {
    margin-bottom: 20px;
  }
`;

interface CommentProps {
  author: AuthorProps;
  date: string;
  body: string;
}

const Comment: React.FC<CommentProps> = ({ author, date, body }) => (
  <StyledComment>
    <Flex className="comment__header" align="center">
      <Avatar
        width="45px"
        height="45px"
        src={`/api/user/${author.username}/avatar/raw?size=45`}
      />
      <span className="color--gray ml-15">
        <a className="text--medium" href={`/users/${author.username}`}>
          {author.name}
        </a>{' '}
        commented {getTimeDiff(date)}
      </span>
    </Flex>
    <ReactMarkdown
      renderers={{ code: CodeBlock }}
      className="markdown-preview"
      source={body}
    />
  </StyledComment>
);

export default Comment;
