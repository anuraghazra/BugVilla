import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import LoginWrapper from '../Signup/Signup.style';
import Flex from 'components/common/Flex';
import Input from 'components/common/Form/Input';
import IconLink from 'components/common/IconLink';
import Button from 'components/common/Button';
import { ToastText as Toast } from 'components/common/Toast';
import BugVillaLogo from 'components/common/Logo';

import { loginUser, checkAuth } from 'store/ducks/auth';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store';
import googleLogo from 'assets/svg/google.svg';
import http from 'utils/httpInstance';
import { notify } from 'react-notify-toast';

// import { GoogleLogin } from 'react-google-login';

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .min(5)
    .max(100)
    .email()
    .required(),
  password: yup
    .string()
    .min(6)
    .max(100)
    .required()
});

const GoogleButton = styled(Button)`
  background-color: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: ${p => p.theme.colors.text.black};
  display: flex;
  align-items: center;
  margin: 10px auto 25px auto;
  /* padding: 20px 30px; */

  img {
    margin-right: 10px;
    width: 20px;
  }
`;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, loginError] = useSelector(({ auth }: StoreState) => [
    auth.isLoginPending,
    auth.loginError
  ]);
  const { register, handleSubmit, errors }: any = useForm({
    validationSchema: LoginSchema
  });

  const onSubmit = async (data: { name: string; email: string }) => {
    dispatch(loginUser(data));
  };

  const googleOauth = () => {
    let url =
      process.env.NODE_ENV === 'development'
        ? 'localhost:5000'
        : window.location.host;

    // window.location.href = `${window.location.protocol}//${url}/api/user/auth/google`;

    let consentScreen: any = window.open(
      `${window.location.protocol}//${url}/api/user/auth/google`,
      '__blank',
      'width=500&height=800'
    );
    // consentScreen.onclose = function () { console.log('closed') }
    window.addEventListener('message', event => {
      if (event.data === 'OAuth Success') {
        dispatch(checkAuth());
      }
    });
  };

  loginError && notify.show(<Toast>{loginError}</Toast>, 'error');
  return (
    <LoginWrapper>
      <Flex align="center" justify="center" direction="column">
        <BugVillaLogo />
        <h2 className="text--bold">Welcome back!</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            type="email"
            icon="envelope"
            placeholder="example@gmail.com"
            errors={errors}
            inputRef={register({ required: 'Email is required' })}
          />

          <Input
            type="password"
            name="password"
            icon="lock"
            placeholder="password"
            errors={errors}
            inputRef={register({ required: 'Password is Required' })}
          />

          <Button
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
            width="50%"
            icon="arrow-right"
          >
            Login
          </Button>
        </form>

        <GoogleButton onClick={googleOauth}>
          <img src={googleLogo} /> Continue with Google
        </GoogleButton>
        <IconLink className="color--gray" to="/">
          Don't have an account?
        </IconLink>
      </Flex>
    </LoginWrapper>
  );
};

export default Login;
