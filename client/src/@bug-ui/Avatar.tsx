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

const AvatarImage = styled.img(p => ({
  width: p.width || 150,
  height: p.height || 150,
  border: p.theme.border,
  borderRadius: '100%',
  objectFit: 'cover',
  margin: 0
}));

export const Avatar: React.FC<AvatarProps> = ({
  username,
  size,
  width,
  height,
  ...props
}) => {
  return (
    <Link style={{ lineHeight: 0 }} to={`/profiles/${username}`}>
      <AvatarImage
        src={`/api/user/${username}/avatar/raw?size=${size}`}
        width={width}
        height={height}
        {...props}
      />
    </Link>
  );
};
export default Avatar;
