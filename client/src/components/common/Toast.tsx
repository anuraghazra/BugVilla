import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notify } from 'react-notify-toast';

createGlobalStyle`

`;

interface StyledToastProps {
  isVisible?: boolean;
}
const StyledToast = styled.span<StyledToastProps>`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  border-radius: 50px;
  color: ${p => p.theme.colors.common.red};
  background-color: ${p => p.theme.colors.common.redlight};
  padding: 15px;

  opacity: ${p => (p.isVisible ? 1 : 0)};
  pointer-events: ${p => (p.isVisible ? 'all' : 'none')};
  transition: 0.3s;

  .close-icon {
    margin-left: 30px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
      transition: 0.2s;
    }
  }

  .message {
    margin-left: 10px;
  }
`;

interface ToastProps {
  isVisible?: boolean;
  message: string;
}

const Toast: React.FC<ToastProps> = ({ isVisible, message }) => {
  const [isToastVisible, setToastVisibility] = useState<any>(null);

  useEffect(() => {
    setToastVisibility(isVisible);
    let timer = window.setTimeout(() => {
      setToastVisibility(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const closeToast = () => {
    setToastVisibility(false);
  };

  return (
    <StyledToast isVisible={isToastVisible}>
      <FontAwesomeIcon icon="exclamation-triangle" />
      <span className="message">{message || 'Something is wrong'}</span>
      <FontAwesomeIcon
        onClick={closeToast}
        className="close-icon"
        icon="times"
      />
    </StyledToast>
  );
};

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
export const ToastText: React.FC<{
  icon?: any;
  children: React.ReactNode;
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

export default Toast;
