import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { CircleIcon } from '@bug-ui';

interface AvatarProps {
  width?: string;
  height?: string;
  username?: string;
  size?: string | number;
  showVerification?: boolean;
  isVerified?: boolean;
  [x: string]: any;
}

const AvatarImage = styled.img(p => ({
  width: p.width || 150,
  height: p.height || 150,
  border: p.theme.border,
  borderRadius: '100%',
  objectFit: 'cover',
  margin: 0
}));

const AvatarWrapper = styled.div`
  a {
    position: relative;
  }
  .verification--status {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
`;

export const Avatar: React.FC<AvatarProps> = ({
  username,
  size,
  width,
  height,
  showVerification,
  isVerified = false,
  ...props
}) => {
  return (
    <AvatarWrapper>
      <Link style={{ lineHeight: 0 }} to={`/profiles/${username}`}>
        <AvatarImage
          src={`/api/user/${username}/avatar/raw?size=${size}`}
          width={width}
          height={height}
          {...props}
        />

        {showVerification && (
          <CircleIcon
            className="verification--status"
            size="25px"
            variant={isVerified ? 'success' : 'danger'}
            icon={isVerified ? 'check' : 'times'}
          />
        )}
      </Link>
    </AvatarWrapper>
  );
};
export default Avatar;
