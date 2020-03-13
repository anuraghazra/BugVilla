import React from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from 'utils';
import { Flex, Avatar, CircleIcon } from '@bug-ui';

import { AuthorProps } from './SingleBug';
import { StyledMetaInfo } from 'components/BugCard/BugCard.style';

interface MetaProps {
  isOpen?: boolean;
  date: string;
  author: AuthorProps;
  commentsCount?: number;
  showAvatar?: boolean;
}

const MetaInfo: React.FC<MetaProps> = ({
  isOpen,
  date,
  author,
  commentsCount,
  showAvatar
}) => (
  <StyledMetaInfo>
    <Flex gap="medium" align="center" nowrap>
      <CircleIcon
        size="30px"
        variant={isOpen ? 'success' : 'danger'}
        icon={isOpen ? 'exclamation' : 'ban'}
      />
      {showAvatar && (
        <Avatar
          width="30px"
          height="30px"
          size={45}
          username={author.username}
        />
      )}
      <span>
        {isOpen ? 'Opened' : 'Closed'} by
        <Link className="text--medium" to={`/profiles/${author.username}`}>
          &nbsp;{author.name}&nbsp;
        </Link>
        on {formatDate(date)}
        {commentsCount ? <span> / {commentsCount} comments</span> : null}
      </span>
    </Flex>
  </StyledMetaInfo>
);

export default React.memo(MetaInfo);
