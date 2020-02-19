import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { formatDate } from 'utils';
import Flex from 'components/common/Flex';

import { AuthorProps } from './SingleBug';
import Avatar from 'components/Avatar/Avatar';
import { StyledMetaInfo } from 'components/BugCard/BugCard.style';
import CircleIcon from 'components/common/CircleIcon';

interface ReferenceProps {
  by: AuthorProps;
  from: number;
  date: string;
}
const StyledReference = styled.div`
  margin-bottom: ${p => p.theme.spacings.bottom / 2}px;
`;

const Reference: React.FC<ReferenceProps> = ({ by, from, date }) => {
  return (
    <StyledReference>
      <StyledMetaInfo>
        <Flex align="center" nowrap>
          <CircleIcon size="30px" icon="retweet" />

          <Avatar
            style={{ marginLeft: 15 }}
            width="30px"
            height="30px"
            size={45}
            username={by.username}
          />
          <span className="ml-15">
            <Link className="text--medium" to={`/profiles/${by.username}`}>
              &nbsp;{by.name}&nbsp;
            </Link>{' '}
            referenced this bug at{' '}
            <Link className="text--medium" to={`/dashboard/bugs/${from}`}>
              #{from}
            </Link>{' '}
            on {formatDate(date)}
          </span>
        </Flex>
      </StyledMetaInfo>
    </StyledReference>
  );
};

export default Reference;
