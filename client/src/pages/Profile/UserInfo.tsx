import React from 'react';
import styled from 'styled-components';

import Avatar from 'components/Avatar/Avatar';
import { getTimeDiff } from 'utils';

const UserInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  @media screen and (${p => p.theme.media.desktop}) {
    grid-template-columns: 1fr;
  }

  .text--standout {
    font-size: 1.5em;
    color: ${p => p.theme.colors.brand.primary};
    font-family: ${p => p.theme.font.primaryMedium};
  }
`;

const UserMetaInfo = styled.div`
  width: 500px;
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-gap: 40px;
  padding-right: 30px;
  border-right: 2px solid ${p => p.theme.colors.brand.accent};

  @media screen and (${p => p.theme.media.desktop}) {
    width: 80%;
    padding-right: 0px;
    grid-template-columns: 1fr;
    justify-items: left;
    border-right: none;
  }
  @media screen and (${p => p.theme.media.tablet}) {
    width: auto;
    justify-items: center;
  }
`;

const StandOut: React.FC<{ value: any; children: React.ReactNode }> = ({
  value,
  children
}) => (
  <p>
    <span className="text--standout">{value + ' '}</span>
    {children}
  </p>
);

interface UserInfoProps {
  user: any;
  totalComments: string | number;
  totalBugs: string | number;
}
const UserInfo: React.FC<UserInfoProps> = ({
  user,
  totalComments,
  totalBugs
}) => (
  <UserInfoWrapper>
    <UserMetaInfo>
      <div>
        <Avatar size={150} username={user.username} />
      </div>
      <div>
        <h2 className="text--medium">{user.name}</h2>
        <span className="color--gray">@{user.username}</span>
        <p>
          I am a javascript lover. Canvas Graphics, Web Interactivity, Web
          Physics Simulations lots of fun stuff i like and love to do.
        </p>
      </div>
    </UserMetaInfo>
    <div>
      <StandOut value={totalComments || 0}>Comments</StandOut>
      <StandOut value={totalBugs || 0}>Bugs issued</StandOut>
      {user.date_joined && (
        <StandOut value={'Joined'}>{getTimeDiff(user.date_joined)}</StandOut>
      )}
    </div>
  </UserInfoWrapper>
);

export default UserInfo;
