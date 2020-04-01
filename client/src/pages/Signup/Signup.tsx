import React, { useState } from 'react';
import { useForm, FormContextValues } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import genericAvatar from 'assets/images/avatar-generic.jpg';

import { Flex, Button, IconLink, BugVillaLogo, toast } from '@bug-ui';
import { Input, StyledH3Input } from '@bug-ui/Form';

import AvatarFileUploader from 'components/AvatarFileUploader';
import SignupSchema from './SignupSchema';

import SignupWrapper from './Signup.style';
import { signUserUp } from 'store/ducks/auth';
import { StoreState } from 'store';
import { GoogleButton } from 'components/GoogleButton';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>();
  const {
    register,
    handleSubmit,
    errors,
    watch
  }: FormContextValues<Record<string, any>> = useForm({
    validationSchema: SignupSchema,
    mode: 'onChange'
  });

  const [isLoading, signupError] = useSelector((state: StoreState) => [
    state.loading['user/SIGN_UP'],
    state.error['user/SIGN_UP']
  ]);

  const onSubmit = (data: any) => {
    const formData = new FormData();
    file && formData.append('image', file);
    for (let name in data) {
      formData.append(name, data[name]);
    }
    dispatch(signUserUp(formData)).then(() => {
      toast.success('Successfully signed up');
    });
  };

  signupError && toast.error(signupError);

  return (
    <SignupWrapper>
      <Flex align="center" justify="center" direction="column">
        <BugVillaLogo />
        <form onSubmit={handleSubmit(onSubmit)}>
          <AvatarFileUploader
            defaultImg={genericAvatar}
            name="image"
            inputRef={register({ required: 'Image is required' })}
            file={file}
            handleFile={file => setFile(file)}
          />

          <StyledH3Input>
            <Input
              autoComplete="off"
              name="name"
              type="text"
              icon="edit"
              placeholder="Enter Your Name"
              errors={errors}
              inputRef={register({ required: 'Name is required' })}
            />
          </StyledH3Input>

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

          <Input
            type="password"
            name="confirmPassword"
            icon="lock"
            placeholder="confirm password"
            errors={errors}
            inputRef={register({
              required: 'Confirm Password is Required',
              validate: (value: string) => {
                return (
                  value === watch('password') ||
                  'Confirm Password does not match'
                );
              }
            })}
          />

          <Button
            isLoading={isLoading}
            type="submit"
            width="50%"
            icon="arrow-right"
          >
            SignUp
          </Button>

          <GoogleButton />
        </form>

        <IconLink className="color--gray" to="/">
          Already have an account?
        </IconLink>
      </Flex>
    </SignupWrapper>
  );
};

export default Signup;
