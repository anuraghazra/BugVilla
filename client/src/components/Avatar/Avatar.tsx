import React from 'react';
import styled from 'styled-components/macro';

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border: ${p => p.theme.border};
  border-radius: 100%;

  margin: 0px;
`

export default Avatar;