import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" exact={true} component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
