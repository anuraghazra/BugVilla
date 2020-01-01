import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import theme from './components/theme';
import GlobalStyles from './styles/globalStyles';

import Home from 'pages/Home/Home';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyles />

        <div>
          <Switch>
            <Route path="/" exact={true} component={Home} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
