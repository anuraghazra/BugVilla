import React from 'react';
import styled from 'styled-components/macro';

interface AvatarProps {
  width: string;
  height: string;
}
const Avatar = styled.img<AvatarProps>`
  width: ${p => p.width || '150px'};
  height: ${p => p.height || '150px'};
  border: ${p => p.theme.border};
  border-radius: 100%;

  margin: 0px;
`

export default Avatar;