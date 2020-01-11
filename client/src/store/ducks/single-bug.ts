import http from 'utils/httpInstance';

// action
export const GET_BUG = 'singlebug/GET_BUG';
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const GET_BUG_LOADING = 'singlebug/GET_BUG_LOADING';
export const GET_BUG_ERROR = 'singlebug/GET_BUG_ERROR';

interface DefaultStateProps {
  bug: any,
  isFetching: boolean;
  error: any;
}

const DEFAULT_STATE: DefaultStateProps = {
  bug: null,
  isFetching: false,
  error: null
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case GET_BUG:
      return { ...state, bug: action.payload, isFetching: false }
    case GET_BUG_LOADING:
      return { ...state, isFetching: true }
    case GET_BUG_ERROR:
      return { ...state, isFetching: false, error: action.payload }
    case CLEAR_BUG_DATA:
      return { ...state, bug: null }
    default:
      return state;
  }
}

export default reducer;


// actions creators
export const clearData = () => ({ type: CLEAR_BUG_DATA })
export const bugLoading = () => ({ type: GET_BUG_LOADING })
export const bugSuccess = (data: any) => ({ type: GET_BUG, payload: data })
export const bugError = (data: any) => ({ type: GET_BUG_ERROR, payload: data })

// side effects
export const fetchBugWithId = (bugId: number) => {
  return async (dispatch: any) => {
    dispatch(clearData());
    dispatch(bugLoading());

    try {
      const res = await http({
        method: 'GET',
        url: `/api/bugs/${bugId}`,
      });
      let { data } = res.data;
      console.log(data)
      dispatch(bugSuccess(data));
    } catch (err) {
      dispatch(bugError(err.response.data))
    }
  }
}