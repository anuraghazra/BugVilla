import React, { useEffect } from 'react';
import styled from 'styled-components/macro';

import { Illustration, Loading, Pagination } from '@bug-ui';
import socket from 'utils/socket';
import useFetch from 'hooks/useFetch';
import useQuery from 'hooks/useQuery';

import DashboardHeader from 'components/DashboardHeader';
import NotificationItem from './NotificationItem';

const NotificationsWrapper = styled.section`
  width: 100%;

  .notification__aside {
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;

const Notifications: React.FC = () => {
  const query = useQuery();
  const currentPage = parseInt(query.get('page') ?? '1');

  let [notificationData, isLoading, error, reFetch] = useFetch(
    `/api/notifications?page=${currentPage}`
  );

  useEffect(() => {
    socket.on('received-notification', () => {
      reFetch({});
    });
  }, []);

  const totalPages = notificationData?.totalPages;
  const notifications = notificationData?.data;

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

    return notifications?.map((notify: any) => (
      <NotificationItem notify={notify} />
    ));
  };

  return (
    <NotificationsWrapper>
      <DashboardHeader>
        <h1>Notifications</h1>
      </DashboardHeader>
      {renderNotifications()}

      {!isLoading && (
        <Pagination
          prependUrl="/dashboard/notifications"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </NotificationsWrapper>
  );
};

export default Notifications;
