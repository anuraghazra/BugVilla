import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from 'components/AuthRoute';

import theme from './components/theme';
import GlobalStyles from './styles/globalStyles';

import Home from 'pages/Home/Home';
import Bugs from 'pages/Bugs/Bugs';
import Login from 'components/Login/Login';
import Signup from 'components/Signup/Signup';
import Dashboard from 'pages/Dashboard/Dashboard';

const NotFound = () => <p>404</p>;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyles />

        <div>
          <Switch>
            <Route path="/" exact={true} component={() => {
              return <Home right={Signup}></Home>
            }} />
            <Route path="/login" component={() => {
              return <Home right={Login}></Home>
            }} />
            <AuthRoute path="/bugs" component={Bugs} />
            <AuthRoute path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
