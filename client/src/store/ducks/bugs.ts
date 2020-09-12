import { ApiAction } from 'store/middlewares/apiMiddleware';
import { createAPIAction } from 'store/helpers';

// action
export const API = 'API';
export const FETCH_BUGS = createAPIAction('bugs/FETCH_BUGS');
export const ADD_BUG = createAPIAction('bugs/ADD_BUG');

const DEFAULT_STATE = <any[]>[];

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUGS.SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export default reducer;

// side effects
export const fetchBugs = (): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: `/api/bugs/`,
  },
  onRequest: FETCH_BUGS.REQUEST,
  onSuccess: FETCH_BUGS.SUCCESS,
  onFailure: FETCH_BUGS.FAILURE,
});

export const addBug = (formData: {
  title: string;
  body: string;
}): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: `/api/bugs/`,
    formData,
  },
  onRequest: ADD_BUG.REQUEST,
  onSuccess: ADD_BUG.SUCCESS,
  onFailure: ADD_BUG.FAILURE,
});
