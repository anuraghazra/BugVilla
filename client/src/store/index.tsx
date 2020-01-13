import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as ducks from './ducks';

const reducers = combineReducers(ducks);
const INITIAL_STATE = {};
const composeSetup =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore(
  reducers,
  INITIAL_STATE,
  composeSetup(applyMiddleware(thunk))
);

// const unsubscribe = store.subscribe(() => console.log(store.getState()))
export default store;
