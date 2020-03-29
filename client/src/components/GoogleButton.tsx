import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { Button, toast } from '@bug-ui';
import { checkAuth } from 'store/ducks/auth';
import googleLogo from 'assets/svg/google.svg';

const StyledGoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: ${p => p.theme.colors.black};
  margin: 10px auto 25px auto !important;

  img {
    margin-right: ${p => p.theme.space.medium}px;
    width: 20px;
  }
`;

export const GoogleButton = () => {
  const dispatch = useDispatch();

  const initOAuthWindow = () => {
    let url =
      process.env.NODE_ENV === 'development'
        ? 'localhost:5000'
        : window.location.host;

    window.open(
      `${window.location.protocol}//${url}/api/user/auth/google`,
      '__blank',
      'width=500&height=800'
    );
    window.addEventListener('message', event => {
      if (event.data === 'success') {
        dispatch(checkAuth())
          .then(() => {
            toast.success('Login success');
          })
          .catch((err: string) => {
            toast.error(err);
          });
      }
    });
  };

  return (
    <StyledGoogleButton onClick={initOAuthWindow}>
      <img src={googleLogo} /> Continue with Google
    </StyledGoogleButton>
  );
};
