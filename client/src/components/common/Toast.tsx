import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StyledProps {
  isVisible?: boolean;
}
const StyledToast = styled.span<StyledProps>`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50px;
  color: ${p => p.theme.colors.common.red};
  background-color: ${p => p.theme.colors.common.redlight};
  padding: 15px;

  opacity: ${p => p.isVisible ? 1 : 0};
  pointer-events: ${p => p.isVisible ? 'all' : 'none'};
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
`

interface Props {
  children: React.ReactNode;
  isVisible?: boolean;
}

const Toast: React.FC<Props> = ({ children, isVisible }) => {
  const [isToastVisible, setToastVisibility] = useState<any>(null);

  useEffect(() => {
    setToastVisibility(isVisible)
    let timer = window.setTimeout(() => {
      setToastVisibility(false);
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [isVisible])

  const closeToast = () => {
    setToastVisibility(false);
  }

  return (
    <StyledToast isVisible={isToastVisible}>
      <FontAwesomeIcon icon="exclamation-triangle" />
      <span className="message">{children}</span>
      <FontAwesomeIcon onClick={closeToast} className="close-icon" icon="times" />
    </StyledToast>
  )
}

export default Toast;
