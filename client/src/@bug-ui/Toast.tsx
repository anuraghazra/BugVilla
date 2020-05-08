import React from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notify } from 'react-notify-toast';

const StyledToastText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .notification__icon {
    margin-right: 10px;
  }
  .close-icon {
    margin-left: 20px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
      transition: 0.2s;
    }
  }
`;

export const Toast: React.FC<{
  icon?: any;
}> = ({ icon = 'exclamation-triangle', children }) => {
  return (
    <StyledToastText>
      <FontAwesomeIcon className="notification__icon" icon={icon} />
      {children}
      <FontAwesomeIcon
        onClick={notify.hide}
        className="close-icon"
        icon="times"
      />
    </StyledToastText>
  );
};

export const toast = {
  error: (message: string) => {
    notify.show(<Toast icon="exclamation-circle">{message}</Toast>, 'error');
  },
  success: (message: string) => {
    notify.show(<Toast icon="check-circle">{message}</Toast>, 'success');
  },
  info: (message: string) => {
    notify.show(<Toast icon="info-circle">{message}</Toast>, 'info');
  }
};

export default Toast;
