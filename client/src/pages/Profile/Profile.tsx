import React from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router-dom';

import { formatDate } from 'utils';
import useFetch from 'hooks/useFetch';
import { Illustration, Loading } from '@bug-ui';

import DashboardHeader from 'components/DashboardHeader';
import BugCard from 'components/BugCard/BugCard';
import UserInfo from './UserInfo';

const breakpointColumns = {
  default: 3,
  1440: 3,
  1024: 2,
  768: 1
};

const ProfileWrapper = styled.section`
  .user__bugs {
    margin-top: ${p => p.theme.spacings.top * 2}px;
  }
`;

const Profile = () => {
  const { username } = useParams();
  const [userData, userLoading, userError] = useFetch(`/api/user/${username}`);
  const [bugData, bugsLoading, bugsError] = useFetch(
    `/api/user/${username}/bugs`
  );
  const [commentsCountData] = useFetch(`/api/user/${username}/comments/count`);

  const isLoading = userLoading || bugsLoading;
  const error = userError || bugsError;
  const user = userData?.data;
  const bugs = bugData?.data || [];
  const commentCount = commentsCountData?.data?.counts;

  const renderUserInfo = () => {
    if (isLoading) return <Loading />;
    if (error) {
      return (
        <Illustration
          type="error"
          message="Something went wrong while loading the data"
        />
      );
    }
    return (
      <>
        {user && (
          <UserInfo
            user={user}
            totalComments={commentCount}
            totalBugs={bugs?.length}
          />
        )}
        <section className="user__bugs">
          <h3>Bugs issued by {username}</h3>
          <br />
          <br />
          {bugs.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {bugs.map((bug: any) => (
                <BugCard
                  key={bug.id}
                  title={bug.title}
                  number={bug.bugId}
                  labels={bug.labels}
                  body={bug.body}
                  isOpen={bug.isOpen}
                  date={formatDate(bug.date_opened)}
                  author={bug.author}
                />
              ))}
            </Masonry>
          ) : (
            <Illustration
              type="empty"
              message={`No bugs issued by ${username}`}
            />
          )}
        </section>
      </>
    );
  };

  return (
    <ProfileWrapper>
      <DashboardHeader>
        <h1>User</h1>
      </DashboardHeader>
      {renderUserInfo()}
    </ProfileWrapper>
  );
};

export default Profile;
