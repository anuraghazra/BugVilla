import React, { useEffect } from 'react';
import Notifications from 'react-notify-toast';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch } from 'react-router-dom';

import { toast } from '@bug-ui';
import theme from '@bug-ui/theme';

import socket from 'utils/socket';
import history from 'utils/history';
import GlobalStyles from './styles/globalStyles';

import Login from 'pages/Login/Login';
import Signup from 'pages/Signup/Signup';
import Home from 'pages/Home/Home';
import Dashboard from 'pages/Dashboard/Dashboard';

import NotFound from 'components/NotFound';
import AuthRoute from 'components/AuthRoute';
import ErrorBoundary from 'components/ErrorBoundary';
import SEO from 'components/SEO';

socket.on('received-notification', () => {
  toast.info('New notifications available');
});

const App: React.FC = () => {
  useEffect(() => {
    // intercept a:href links in markdown
    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.markdown-preview') || e.target.tagName !== 'A') {
        return;
      }
      const href = e.target.getAttribute('href');
      if (href.match(/http(s?):\/\//)) return;
      e.preventDefault();
      history.push(href);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SEO title="BugVilla | Universal bug tracker for everyone!" />

      <Router history={history}>
        <Notifications
          options={{
            zIndex: 200,
            top: '85%',
            colors: {
              error: {
                color: theme.colors.red,
                backgroundColor: theme.colors.redlight,
              },
              success: {
                color: theme.colors.green,
                backgroundColor: theme.colors.greenlight,
              },
              info: {
                color: theme.colors.primary,
                backgroundColor: theme.colors.accent,
              },
            },
          }}
        />
        <GlobalStyles />
        <ErrorBoundary>
          <div>
            <Switch>
              <Route path="/" exact>
                <Home right={Login} />
              </Route>
              <Route path="/signup" exact>
                <Home right={Signup} />
              </Route>

              <AuthRoute path="/" component={Dashboard} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;
