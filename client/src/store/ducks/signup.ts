import http from 'httpInstance';
import { Dispatch } from "redux";

// action
const SIGNUP_SUCCESS = 'signup/SIGNUP_SUCCESS';
const SIGNUP_ERROR = 'signup/SIGNUP_ERROR';
const SIGNUP_LOADING = 'signup/SIGNUP_LOADING';


const DEFAULT_STATE = {
  isLoading: false,
  isError: false,
  success: false,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: { type: string, payload: any }) => {
  switch (action.type) {
    case SIGNUP_LOADING:
      return { ...state, isLoading: true }
    case SIGNUP_ERROR:
      return { ...state, isError: action.payload, isLoading: false }
    case SIGNUP_SUCCESS:
      return { ...state, success: true, isError: false, isLoading: false }
    default:
      return state;
  }
}

export default reducer;


// actions creators
export const userSignupAction = (data: object) => ({ type: SIGNUP_SUCCESS, payload: data })
export const userSignupError = (data: object) => ({ type: SIGNUP_ERROR, payload: data })

// side effects
export const signUserUp = (formData: FormData, history: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/signup',
        data: formData,
      });
      dispatch(userSignupAction(res.data));
      history.push('/login')
    }
    catch (err) {
      dispatch(userSignupError(err.response.data))
    }
  }
}
