import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import Flex from 'components/common/Flex';
import Input from 'components/common/Form/Input';
import IconLink from 'components/common/IconLink';
import Button from 'components/common/Button';
import Toast from 'components/common/Toast';
import BugVillaLogo from 'components/common/Logo';

import AvatarFileUploader from 'components/AvatarFileUploader/AvatarFileUploader';
import SignupWrapper, { StyledH3Input } from './Signup.style';
import SignupSchema from './SignupSchema';

import { signUserUp, signupClearError } from 'store/ducks/auth';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.auth.isSignupPending);
  const signupError = useSelector((state: any) => state.auth.signupError);
  const [file, setFile] = useState<any>();

  const { register, handleSubmit, errors, watch }: any = useForm({
    validationSchema: SignupSchema
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    file && formData.append('image', file);
    for (let name in data) {
      formData.append(name, data[name]);
    }
    dispatch(signUserUp(formData));
  };

  return (
    <SignupWrapper>
      <Toast isVisible={!!signupError} message={signupError} />
      
      <Flex align="center" justify="center" direction="column">
        <BugVillaLogo />
        <form onSubmit={handleSubmit(onSubmit)}>
          <AvatarFileUploader
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
            name="username"
            type="text"
            icon="user"
            placeholder="user-name"
            errors={errors}
            inputRef={register({ required: 'Username is required' })}
          />

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
        </form>

        <IconLink className="color--gray" to="/login">
          Already have an account?
        </IconLink>
      </Flex>
    </SignupWrapper>
  );
};

export default Signup;
