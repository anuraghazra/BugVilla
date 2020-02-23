import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledLabel } from 'components/common/Label';

const StyledNotificationIcon = styled(StyledLabel)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0;
  margin-right: 15px;
`;

const NotificationIcon: React.FC<{ type: string; bugStatus?: string }> = ({
  type,
  bugStatus
}) => {
  const icons: any = {
    COMMENTED: ['comment', 'secondary'],
    MENTIONED: ['at', 'secondary'],
    // bugStatus special case,
    // change icon and color depending on 'close' or 'open' state
    BUG_STATUS: [
      bugStatus === 'opened' ? 'exclamation' : 'ban',
      bugStatus === 'opened' ? 'success' : 'danger'
    ],
    REFERENCED: ['retweet', 'success'],
    NEW_BUG: ['bug', 'danger']
  };
  return (
    <StyledNotificationIcon
      variant={icons[type][1]}
    >
      <FontAwesomeIcon className="faIcon" icon={icons[type][0]} />
    </StyledNotificationIcon>
  );
};

export default NotificationIcon;
