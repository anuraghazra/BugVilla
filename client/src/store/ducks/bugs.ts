import { ApiAction } from 'store/middlewares/apiMiddleware';

// action
export const API = 'API';
export const FETCH_BUGS_REQUEST = 'bugs/FETCH_BUGS_REQUEST';
export const FETCH_BUGS_SUCCESS = 'bugs/FETCH_BUGS_SUCCESS';
export const FETCH_BUGS_FAILURE = 'bugs/FETCH_BUGS_FAILURE';

const DEFAULT_STATE = <any[]>[]

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUGS_SUCCESS:
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
    request: FETCH_BUGS_REQUEST,
    success: FETCH_BUGS_SUCCESS,
    error: FETCH_BUGS_FAILURE
  }
});