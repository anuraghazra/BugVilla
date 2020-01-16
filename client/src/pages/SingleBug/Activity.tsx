import React from 'react';
import styled from 'styled-components';
import { AuthorProps } from './SingleBug';
import MetaInfo from './MetaInfo';

const StyledActivity = styled.div`
  margin-bottom: ${p => p.theme.spacings.bottom / 2}px;
`;

interface ActivityProps {
  author: AuthorProps;
  date: string;
  action: string;
}

const Activity: React.FC<ActivityProps> = ({ author, date, action }) => (
  <StyledActivity>
    <MetaInfo
      author={author}
      date={date}
      showAvatar={true}
      isOpen={action == 'opened'}
    />
  </StyledActivity>
);

export default React.memo(Activity);
