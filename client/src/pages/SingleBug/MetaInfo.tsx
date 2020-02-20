import React from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from 'utils';
import Flex from 'components/common/Flex';
import Avatar from 'components/common/Avatar';
import CircleIcon from 'components/common/CircleIcon';

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
    <Flex align="center" nowrap>
      <CircleIcon
        size="30px"
        variant={isOpen ? 'success' : 'danger'}
        icon={isOpen ? 'exclamation' : 'ban'}
      />
      {showAvatar && (
        <Avatar
          style={{ marginLeft: 15 }}
          width="30px"
          height="30px"
          size={45}
          username={author.username}
        />
      )}
      <span className="ml-15">
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
