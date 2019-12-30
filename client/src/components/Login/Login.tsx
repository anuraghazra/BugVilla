import React from 'react';

interface Props {
  message: string;
}

const Login: React.FC<Props> = ({message}) => {
  return (
    <>
      <p>login page, {message}</p>
    </>
  )
}

export default Login;