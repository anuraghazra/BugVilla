import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatusIconWrapper = styled.div<{ isOpen?: boolean }>`
  align-items: center;
  justify-content: center;
  display: flex;

  width: 30px;
  height: 30px;
  border-radius: 50px;

  color: ${p =>
    p.isOpen ? p.theme.colors.common.green : p.theme.colors.common.red};
  background-color: ${p =>
    p.isOpen
      ? p.theme.colors.common.greenlight
      : p.theme.colors.common.redlight};
`;

interface Props {
  isOpen?: boolean;
  [x: string]: any;
}
const StatusIcon: React.FC<Props> = ({ isOpen, ...props }) => (
  <StatusIconWrapper isOpen={isOpen} {...props}>
    <FontAwesomeIcon icon={isOpen ? 'exclamation' : 'ban'} />
  </StatusIconWrapper>
);

export default StatusIcon;
