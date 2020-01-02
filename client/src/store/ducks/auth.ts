import http from 'httpInstance';
import { Dispatch } from "redux";

// action
const AUTH_SUCCESS = 'login/AUTH_SUCCESS';
const AUTH_ERROR = 'login/AUTH_ERROR';
const AUTH_LOADING = 'login/AUTH_LOADING';
const SIGNUP_SUCCESS = 'signup/SIGNUP_SUCCESS';
const SIGNUP_ERROR = 'signup/SIGNUP_ERROR';


const DEFAULT_STATE = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: { type: string, payload: any }) => {
  console.log(action)
  switch (action.type) {
    case AUTH_LOADING:
      return { ...state, isLoading: true }
    case AUTH_ERROR:
      return {
        ...state,
        error: "ERR",
        isLoading: false
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
        isLoading: false,
      }
    default:
      return state;
  }
}

export default reducer;


// actions creators
export const userLoadingAction = () => ({ type: AUTH_LOADING })
export const userLoginSuccess = (data: object) => ({ type: AUTH_SUCCESS, payload: data })
export const userLoginError = (data: object) => ({ type: AUTH_ERROR, payload: data })
export const userSignupSuccess = (data: object) => ({ type: SIGNUP_SUCCESS, payload: data })
export const userSignupError = (data: object) => ({ type: SIGNUP_ERROR, payload: data })

// side effects
export const signUserUp = (formData: FormData, history: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(userLoadingAction());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/signup',
        data: formData,
      });
      dispatch(userSignupSuccess(res.data));
      history.push('/login')
    }
    catch (err) {
      dispatch(userSignupError(err.response.data))
    }
  }
}

// side effects
export const loginUser = (formData: any, history: any) => {
  return async (dispatch: Dispatch) => {
    dispatch(userLoadingAction());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/login',
        data: formData,
      });
      dispatch(userLoginSuccess(res.data));
      history.push('/bugs')
    }
    catch (err) {
      dispatch(userLoginError(err.response.data))
    }
  }
}
