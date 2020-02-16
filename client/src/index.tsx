import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/fontStyles.css';

import registerIcons from './fontLib';
import App from './App';
import * as serviceWorker from './serviceWorker';

import store from './store';
import { Provider } from 'react-redux';

import auth from 'utils/authHelper';
import history from 'utils/history';
import { checkAuth, setUser } from 'store/ducks/auth';

registerIcons();

// if (auth.loggedIn()) {
//   store.dispatch(setUser(auth.getUser()));
//  // history.push('/dashboard');
// }
store.dispatch(checkAuth());

// if (localStorage.getItem('IsAuthenticated')) {
  // store.dispatch(setUser({ username: '' }));
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
