import React from 'react';
import styled from 'styled-components';
import { Flex, Loading, Avatar, Illustration } from '@bug-ui';

import useFetch from 'hooks/useFetch';
import DashboardHeader from 'components/DashboardHeader';

const ProfilesWrapper = styled.section`
  .users {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-row-gap: 50px;
    margin-top: ${p => p.theme.spacings.top * 2}px;

    h3 {
      word-break: break-all;
    }
  }
`;

const Profiles = () => {
  const [users, isLoading, error] = useFetch(`/api/user`);

  const renderProfiles = () => {
    if (isLoading) return <Loading />;
    if (error) {
      return (
        <Illustration
          type="error"
          message="Something went wrong while loading the data"
        />
      );
    }
    if (users?.data?.length === 0) return <Illustration type="empty" />;

    return users?.data?.map((user: any) => (
      <Flex align="center" direction="column">
        <Avatar width="130" height="130" username={user.username} />
        <h3 className="text--bold mt-small">{user.name}</h3>
        <span className="color--gray">@{user.username}</span>
      </Flex>
    ));
  };

  return (
    <ProfilesWrapper>
      <DashboardHeader>
        <h1>All Profiles</h1>
      </DashboardHeader>

      <div className="users">{renderProfiles()}</div>
    </ProfilesWrapper>
  );
};

export default Profiles;
