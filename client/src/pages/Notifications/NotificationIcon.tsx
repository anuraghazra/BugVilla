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
    commented: ['comment', 'help-wanted'],
    mentioned: ['at', 'help-wanted'],
    // bugStatus special case,
    // change icon and color depending on 'close' or 'open' state
    bug_status: [
      bugStatus === 'opened' ? 'exclamation' : 'ban',
      bugStatus === 'opened' ? 'feature' : 'bug'
    ],
    referenced: ['retweet', 'feature'],
    new_bug: ['bug', 'feature']
  };
  return (
    <StyledNotificationIcon
      className={`${icons[type][1]} ${icons[type][1]}--bg`}
    >
      <FontAwesomeIcon className="faIcon" icon={icons[type][0]} />
    </StyledNotificationIcon>
  );
};

export default NotificationIcon;
