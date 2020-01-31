import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as ducks from './ducks';
import api from './middlewares/apiMiddleware';
import { AuthReducerState } from './ducks/auth';
import { SinglebugReducerState } from './ducks/single-bug';

const reducers = combineReducers(ducks);
const INITIAL_STATE = {};
const composeSetup =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export interface StoreState {
  bugs: any[];
  auth: AuthReducerState;
  singlebug: SinglebugReducerState;
  loading: {
    [x: string]: boolean;
  };
  error: {
    [x: string]: string;
  };
}
const store = createStore(
  reducers,
  INITIAL_STATE,
  composeSetup(applyMiddleware(thunk, api))
);

// const unsubscribe = store.subscribe(() => console.log(store.getState()))
export default store;
