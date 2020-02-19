import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch } from 'react-router-dom';
import AuthRoute from 'components/AuthRoute';

import history from 'utils/history';
import theme from './theme';
import GlobalStyles from './styles/globalStyles';

import Login from 'components/Login/Login';
import Signup from 'components/Signup/Signup';

import Home from 'pages/Home/Home';
import Dashboard from 'pages/Dashboard/Dashboard';
import NotFound from 'components/NotFound';
import Notifications from 'react-notify-toast';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Notifications
          options={{
            zIndex: 200,
            top: '85%',
            colors: {
              error: {
                color: theme.colors.common.red,
                backgroundColor: theme.colors.common.redlight
              },
              success: {
                color: theme.colors.common.green,
                backgroundColor: theme.colors.common.greenlight
              },
              info: {
                color: theme.colors.brand.primary,
                backgroundColor: theme.colors.brand.accent
              }
            }
          }}
        />
        <GlobalStyles />

        <div>
          <Switch>
            <Route path="/" exact>
              <Home right={Signup} />
            </Route>
            <Route path="/login" exact>
              <Home right={Login} />
            </Route>

            <AuthRoute path="/" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
