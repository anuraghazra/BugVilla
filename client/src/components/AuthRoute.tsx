import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
  component: Function,
  [x: string]: any
}

const AuthRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  // const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  const isAuthenticated = true;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  );
}

export default AuthRoute;