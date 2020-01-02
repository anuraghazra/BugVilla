import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import * as ducks from './ducks';

const reducers = combineReducers(ducks)
const INITIAL_STATE = {}

const store = createStore(
  reducers,
  INITIAL_STATE,
  compose(
    applyMiddleware(thunk),
    // (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  )
);

// const unsubscribe = store.subscribe(() => console.log(store.getState()))
export default store;