import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';

interface AuthRouteProps {
  component: Function;
  [x: string]: any;
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = useSelector(
    (state: StoreState) => state.auth.isAuthenticated
  );
  // https://stackoverflow.com/a/56175010/10629172
  const checkingAuthStatus = useSelector(
    (state: StoreState) => state.loading['auth/CHECK_AUTH']
  );

  return (
    <Route
      {...rest}
      render={props =>
        checkingAuthStatus ? (
          <></>
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default AuthRoute;
