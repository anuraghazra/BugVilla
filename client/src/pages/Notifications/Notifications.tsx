import React from 'react';
import styled from 'styled-components/macro';

import Loading from 'components/common/Loading';
import useFetch from 'hooks/useFetch';

import DashboardHeader from 'components/DashboardHeader';
import NotificationItem from './NotificationItem';

const NotificationsWrapper = styled.section`
  width: 100%;

  .notification__aside {
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;

const Notifications: React.FC = () => {
  let [notifications, isLoading, error] = useFetch('/api/notifications');

  notifications = notifications?.data || [];
  return (
    <NotificationsWrapper>
      <div>
        <DashboardHeader>
          <h1>Notifications</h1>
        </DashboardHeader>

        {isLoading && <Loading />}
        {error && <p>Something went wrong while fetching data</p>}

        {notifications.reverse().map((notify: any) => {
          return <NotificationItem notify={notify} />;
        })}
      </div>
    </NotificationsWrapper>
  );
};

export default Notifications;
