import React from 'react';
import * as yup from 'yup';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import LoginWrapper from '../Signup/Signup.style';
import { Button, BugVillaLogo, Flex, IconLink, toast } from '@bug-ui';
import { Input } from '@bug-ui/Form';

import { StoreState } from 'store';
import { loginUser, checkAuth } from 'store/ducks/auth';
import googleLogo from 'assets/svg/google.svg';

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

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [isLoading, loginError] = useSelector((state: StoreState) => [
    state.loading['user/LOGIN'],
    state.error['user/LOGIN']
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

  loginError && toast.error(loginError);
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
