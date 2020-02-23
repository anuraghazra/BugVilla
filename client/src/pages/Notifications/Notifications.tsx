import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

import socket from 'utils/socket';
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
  let [notifications, isLoading, error, reFetch] = useFetch(
    '/api/notifications'
  );

  useEffect(() => {
    socket.on('received-notification', (data: any) => {
      reFetch({});
    });
  }, []);

  notifications = notifications?.data || [];
  console.log(notifications);
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
