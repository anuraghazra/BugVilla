import { ApiAction } from 'store/middlewares/apiMiddleware';
import { createAPIAction } from 'store/helpers';

// action
export const API = 'API';
export const FETCH_BUGS = createAPIAction('bugs/FETCH_BUGS');

const DEFAULT_STATE = <any[]>[]

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUGS.SUCCESS:
      return [...action.payload]
    default:
      return state
  }
}

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