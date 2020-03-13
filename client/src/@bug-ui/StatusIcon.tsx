import React from 'react';
import CircleIcon from './CircleIcon';

interface StatusIconProps {
  isOpen?: boolean;
  referred?: boolean;
  [x: string]: any;
}
export const StatusIcon: React.FC<StatusIconProps> = ({
  isOpen,
  referred,
  ...props
}) => (
  <div {...props}>
    <CircleIcon
      size="30px"
      variant={isOpen ? 'success' : referred ? 'primary' : 'danger'}
      icon={isOpen ? 'exclamation' : referred ? 'retweet' : 'ban'}
    />
  </div>
);

export default StatusIcon;
