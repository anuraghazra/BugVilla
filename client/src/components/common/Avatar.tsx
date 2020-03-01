import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

interface AvatarProps {
  width?: string;
  height?: string;
  username?: string;
  size?: string | number;
  [x: string]: any;
}

export const StyledAvatar = styled.img<AvatarProps>`
  width: ${p => p.width || '150px'};
  height: ${p => p.height || '150px'};
  border: ${p => p.theme.border};
  border-radius: 100%;
  object-fit: cover;
  margin: 0px;
`;

const Avatar: React.FC<AvatarProps> = ({
  username,
  size,
  width,
  height,
  ...props
}) => {
  return (
    <Link to={`/profiles/${username}`}>
      <StyledAvatar
        src={`/api/user/${username}/avatar/raw?size=${size}`}
        width={width}
        height={height}
        {...props}
      />
    </Link>
  );
};

export default Avatar;
