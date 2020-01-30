import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatusIconWrapper = styled.div<{ isOpen?: boolean; referred?: boolean }>`
  align-items: center;
  justify-content: center;
  display: flex;

  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50px;

  ${p =>
    p.isOpen === true
      ? css`
          color: ${p => p.theme.colors.common.green};
          background-color: ${p => p.theme.colors.common.greenlight};
        `
      : css`
          color: ${p => p.theme.colors.common.red};
          background-color: ${p => p.theme.colors.common.redlight};
        `}

  ${p =>
    p.referred &&
    css`
      color: ${p => p.theme.colors.brand.primary};
      background-color: ${p => p.theme.colors.brand.accent};
    `}
`;

interface StatusIconProps {
  isOpen?: boolean;
  referred?: boolean;
  [x: string]: any;
}
const StatusIcon: React.FC<StatusIconProps> = ({
  isOpen,
  referred,
  ...props
}) => (
  <StatusIconWrapper isOpen={isOpen} referred={referred} {...props}>
    <FontAwesomeIcon
      icon={isOpen ? 'exclamation' : referred ? 'retweet' : 'ban'}
    />
  </StatusIconWrapper>
);

export default StatusIcon;
