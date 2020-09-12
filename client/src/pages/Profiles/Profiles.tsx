import React from 'react';
import styled from 'styled-components';
import { Flex, Loading, Avatar, Illustration, Pagination } from '@bug-ui';

import useFetch from 'hooks/useFetch';
import useQuery from 'hooks/useQuery';
import DashboardHeader from 'components/DashboardHeader';

const ProfilesWrapper = styled.section`
  .users {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-row-gap: 50px;
    margin-top: ${p => p.theme.spacings.top * 2}px;
    margin-bottom: ${p => p.theme.spacings.bottom * 2}px;

    h3 {
      word-break: break-all;
    }
  }
`;

const Profiles = () => {
  const query = useQuery();
  const currentPage = parseInt(query.get('page') ?? '1');
  const [users, isLoading, error] = useFetch(`/api/user?page=${currentPage}`, {
    cache: true,
  });

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

    return users?.data.map((user: any) => (
      <Flex key={user.id} align="center" direction="column">
        <Avatar
          showVerification
          isVerified={user.isVerified}
          width="130"
          height="130"
          username={user.username}
        />
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

      <span className="color--gray">Total Users: {users?.totalDocs ?? 0}</span>
      <div className="users">{renderProfiles()}</div>

      {!isLoading && (
        <Pagination
          prependUrl="/profiles"
          currentPage={currentPage}
          totalPages={users?.totalPages}
        />
      )}
    </ProfilesWrapper>
  );
};

export default Profiles;
