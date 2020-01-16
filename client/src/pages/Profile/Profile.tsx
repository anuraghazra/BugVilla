import React from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { useParams } from 'react-router-dom';

import { formatDate } from 'utils';
import useFetch from 'hooks/useFetch';
import Loading from 'components/common/Loading';

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
  .text--standout {
    font-size: 1.5em;
    color: ${p => p.theme.colors.brand.primary};
    font-family: ${p => p.theme.font.primaryMedium};
  }

  .user__bugs {
    margin-top: ${p => p.theme.spacings.top * 2}px;
  }
`;

const Profile = () => {
  const { username } = useParams();
  const { data: userData, isLoading: userLoading, error: userError } = useFetch(
    `/api/user/${username}`
  );
  const { data: bugData, isLoading: bugsLoading, error: bugsError } = useFetch(
    `/api/user/${username}/bugs`
  );
  const { data: commentsCountData } = useFetch(
    `/api/user/${username}/comments/count`
  );

  const isLoading = userLoading && bugsLoading;
  const error = userError && bugsError;
  const user = userData?.data;
  const bugs = bugData?.data;
  const commentCount = commentsCountData?.data?.counts;

  if (isLoading) return <Loading />;
  if (error) return <p>Something went wrong while fetching the data</p>;

  return (
    <ProfileWrapper>
      <DashboardHeader>
        <h1>User</h1>
      </DashboardHeader>
      {user && (
        <UserInfo
          user={user}
          totalComments={commentCount}
          totalBugs={bugs && bugs.length}
        />
      )}
      {bugs && (
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
            <h3>
              <span className="color--gray">@{username}</span> did not issued
              any bugs yet!
            </h3>
          )}
        </section>
      )}
    </ProfileWrapper>
  );
};

export default Profile;
