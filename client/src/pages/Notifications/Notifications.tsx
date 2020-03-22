import React, { useEffect } from 'react';
import styled from 'styled-components/macro';

import { Illustration, Loading } from '@bug-ui';
import socket from 'utils/socket';
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

  notifications = notifications?.data;

  const renderNotifications = () => {
    if (isLoading) return <Loading />;
    if (error) {
      return (
        <Illustration
          message="Something went wrong while loading the data"
          type="error"
        />
      );
    }
    if (notifications?.length === 0) return <Illustration type="empty" />;

    return notifications
      ?.reverse()
      .map((notify: any) => <NotificationItem notify={notify} />);
  };

  return (
    <NotificationsWrapper>
      <DashboardHeader>
        <h1>Notifications</h1>
      </DashboardHeader>
      {renderNotifications()}
    </NotificationsWrapper>
  );
};

export default Notifications;
