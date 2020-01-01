import React from 'react';
import styled from 'styled-components/macro';
import Flex from 'components/common/Flex';

import Logo from 'assets/svg/BugVilla.svg'
import Input from 'components/common/Form/Input';
import IconLink from 'components/common/IconLink';
import Button from 'components/common/Button';

const LoginWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;

  .logo {
    width: 100px
  }

  form {
    width: 300px;
    margin-top: ${p => p.theme.spacings.my};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const Login: React.FC = () => {
  return (
    <LoginWrapper>
      <Flex align="center" justify="center" direction="column">
        <img className="logo" src={Logo} alt="BugVilla Logo" />
        <h2 className="text--bold">Join The Team</h2>

        <form>
          <Input icon="envelope" type="email" placeholder="example@gmail.com" />
          <Input icon="lock" type="password" placeholder="password" />
          <Input icon="lock" type="password" placeholder="confirm password" />

          <Button width="50%" icon="arrow-right">SignUp</Button>
          <IconLink className="color--gray" to="/login">
            Already have an account?
          </IconLink>
        </form>
      </Flex>
    </LoginWrapper>
  )
}

export default Login;