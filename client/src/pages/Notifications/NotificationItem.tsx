import React from 'react';
import styled from 'styled-components';

import { Flex } from '@bug-ui';
import { timeAgo } from 'utils';

import NotificationIcon from './NotificationIcon';
import notification_switch from './notification_switch';

const StyledNotificationItem = styled.div`
  padding: 15px;
  margin: 20px 0;

  .notification__time {
    text-align: right;
  }
  span,
  small {
    font-size: 16px;
    margin: auto 0;
  }
  small {
    font-size: 14px;
    color: ${p => p.theme.colors.gray};
  }

  a {
    font-size: 16px;
    color: ${p => p.theme.colors.primary};

    &:hover {
      color: ${p => p.theme.colors.black};
    }
  }

  @media screen and (${p => p.theme.media.desktop}) {
    padding: 0px;
    margin: 30px 0;
    small {
      margin: 0;
    }
  }
`;

interface NotificationItemProps {
  notify: any;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notify }) => {
  return (
    <StyledNotificationItem>
      <Flex justify="space-between" nowrap>
        <Flex style={{ width: '85%' }} gap="large" nowrap>
          <NotificationIcon bugStatus={notify.bug_status} type={notify.type} />
          <span>{notification_switch[notify.type](notify)}</span>
        </Flex>
        <small className="notification__time">
          &nbsp;{timeAgo(notify.createdAt)}
        </small>
      </Flex>
    </StyledNotificationItem>
  );
};

export default NotificationItem;
