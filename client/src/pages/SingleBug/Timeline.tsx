import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Avatar from 'components/common/Avatar';
import CircleIcon from 'components/common/CircleIcon';
import Flex from 'components/common/Flex';

import { formatDate } from 'utils';
import { AuthorProps } from './SingleBug';
import { StyledMetaInfo } from 'components/BugCard/BugCard.style';

interface TimelineProps {
  author: AuthorProps;
  date: string;
  from: any;
  action: string;
}

const StyledTimeline = styled(StyledMetaInfo)`
  margin: 0;
  margin-bottom: 20px;

  :last-child {
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;

const Timeline: React.FC<TimelineProps> = ({ author, date, from, action }) => {
  const isReference: boolean = !action;
  let variant: any = 'secondary';
  let icon: any = 'retweet';
  if (action === 'opened') {
    variant = 'success';
    icon = 'exclamation';
  } else if (action === 'closed') {
    variant = 'danger';
    icon = 'ban';
  }

  let renderExcerpt = (
    <span className="ml-15">
      {!isReference && (
        <>{action === 'opened' ? 'Opened' : 'Closed'} by&nbsp;</>
      )}
      <Link className="text--medium" to={`/profiles/${author.username}`}>
        {author.name}&nbsp;
      </Link>
      {isReference && (
        <>
          referenced this bug at{' '}
          <Link className="text--medium" to={`/dashboard/bugs/${from}`}>
            #{from}
          </Link>{' '}
        </>
      )}
      on {formatDate(date)}
    </span>
  );

  return (
    <StyledTimeline>
      <Flex align="center" nowrap>
        <CircleIcon
          className="icon"
          size="30px"
          variant={variant}
          icon={icon}
        />

        <Avatar
          style={{ marginLeft: 15 }}
          width="30px"
          height="30px"
          size={45}
          username={author.username}
        />

        {renderExcerpt}
      </Flex>
    </StyledTimeline>
  );
};

export default Timeline;
