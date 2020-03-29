import React from 'react';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormContextValues } from 'react-hook-form';

import LoginWrapper from '../Signup/Signup.style';
import { Button, BugVillaLogo, Flex, IconLink, toast } from '@bug-ui';
import { Input } from '@bug-ui/Form';

import { StoreState } from 'store';
import { loginUser } from 'store/ducks/auth';
import { GoogleButton } from 'components/GoogleButton';

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

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [isLoading, loginError] = useSelector((state: StoreState) => [
    state.loading['user/LOGIN'],
    state.error['user/LOGIN']
  ]);
  const {
    register,
    handleSubmit,
    errors
  }: FormContextValues<Record<string, any>> = useForm({
    validationSchema: LoginSchema,
    mode: 'onChange'
  });

  const onSubmit = async (data: { name: string; email: string }) => {
    dispatch(loginUser(data));
  };

  loginError && toast.error(loginError);
  return (
    <LoginWrapper>
      <Flex align="center" justify="center" direction="column">
        <BugVillaLogo />
        <h2 className="text--bold">Welcome back!</h2>

        <form onSubmit={handleSubmit(onSubmit as any)}>
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
        
        <GoogleButton />

        <IconLink className="color--gray" to="/signup">
          Don't have an account?
        </IconLink>
      </Flex>
    </LoginWrapper>
  );
};

export default Login;
