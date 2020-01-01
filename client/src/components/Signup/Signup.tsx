import React, { useState } from 'react';
import * as yup from 'yup'
import slugify from 'slugify';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SignupWrapper from './Signup.style';
import Flex from 'components/common/Flex';

import Logo from 'assets/svg/BugVilla.svg'
import Input from 'components/common/Form/Input';
import IconLink from 'components/common/IconLink';
import Button from 'components/common/Button';

import AvatarFileUploader from 'components/AvatarFileUploader/AvatarFileUploader'

import { useSelector, useDispatch } from 'react-redux';
import { signUserUp } from 'store/ducks/signup';

const SignupSchema = yup.object().shape({
  name: yup.string().min(6).max(100).trim().required(),
  email: yup.string().min(5).max(100).required().email(),
  password: yup.string().min(6).max(100).required(),
  confirmPassword:
    yup.string()
      .min(6).max(100)
      .oneOf([yup.ref('password'), null], "Confirm Password does not match")
      .required(),
  avatar: yup.string()
})

const Signup: React.FC = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('Enter Your Name');
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

    // submit form
    dispatch(signUserUp(formData))
  }

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  }

  return (
    <SignupWrapper>
      <Flex align="center" justify="center" direction="column">
        <img className="logo" src={Logo} alt="BugVilla Logo" />
        <h2 className="text--bold">Join The Team</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AvatarFileUploader
            name="image"
            inputRef={register({ required: 'Image is required' })}
            file={file}
            handleFile={(file) => setFile(file)}
          />

          <h3 className="signup__username">
            <input
              autoComplete="off"
              name="name"
              maxLength={20}
              placeholder="Enter your name"
              onChange={handleNameChange}
              type="text"
              value={name}
              ref={register({ required: 'Name is required' })}
            />
            <FontAwesomeIcon icon="edit" />
          </h3>
          <p className="signup__username--text">{slugify(name, { lower: true })}</p>

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
                return value === watch('password') || 'Confirm Password does not match';
              },
            })}
          />

          <Button type="submit" width="50%" icon="arrow-right">SignUp</Button>
        </form>
        <IconLink className="color--gray" to="/signup">
          Already have an account?
        </IconLink>
      </Flex>
    </SignupWrapper>
  )
}

export default Signup;