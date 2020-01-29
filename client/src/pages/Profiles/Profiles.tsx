import React from 'react';
import styled from 'styled-components';

import useFetch from 'hooks/useFetch';
import Flex from 'components/common/Flex';
import Loading from 'components/common/Loading';

import Avatar from 'components/Avatar/Avatar';
import DashboardHeader from 'components/DashboardHeader';

const ProfilesWrapper = styled.section`
  .users {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-row-gap: 50px;
    margin-top: ${p => p.theme.spacings.top * 2}px;
  }
`;

const Profiles = () => {
  const { data: users, isLoading, error } = useFetch(`/api/user`);

  if (isLoading) return <Loading />;
  if (error) return <p>Something went wrong while fetching the data</p>;
  console.log(users)
  return (
    <ProfilesWrapper>
      <DashboardHeader>
        <h1>All Profiles</h1>
      </DashboardHeader>

      <div className="users">
        {users &&
          users.data.map((user: any) => (
            <Flex align="center" direction="column">
              <Avatar width="130" height="130" username={user.username} />
              <h3 className="text--bold">{user.name}</h3>
              <span className="color--gray">@{user.username}</span>
            </Flex>
          ))}
      </div>
    </ProfilesWrapper>
  );
};

export default Profiles;
