import auth from 'utils/authHelper';
import history from 'utils/history';
import { Dispatch } from 'redux';
import { API } from './single-bug';

// action
export const AUTH_LOGOUT = 'auth/LOGOUT';
export const AUTH_SET_USER = 'auth/SET_USER';

export const CHECK_AUTH_REQUEST = 'auth/CHECK_AUTH_REQUEST';
export const CHECK_AUTH_FAILURE = 'auth/CHECK_AUTH_FAILURE';
export const CHECK_AUTH_SUCCESS = 'auth/CHECK_AUTH_SUCCESS';

export const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'login/LOGIN_FAILURE';
export const LOGIN_LOADING = 'login/LOADING';
export const LOGIN_CLEAR_ERROR = 'login/CLEAR_ERROR';

export const SIGNUP_SUCCESS = 'signup/SUCCESS';
export const SIGNUP_ERROR = 'signup/ERROR';
export const SIGNUP_LOADING = 'signup/LOADING';
export const SIGNUP_CLEAR_ERROR = 'signup/CLEAR_ERROR';


interface UserProps {
  username?: string;
  name?: string;
  id?: number;
}
export interface AuthReducerState {
  isAuthenticated: boolean,
  isLoginPending: boolean,
  isSignupPending: boolean,
  loginError: string,
  signupError: string,
  user: UserProps;
}

const DEFAULT_STATE: AuthReducerState = {
  isAuthenticated: false,
  isLoginPending: false,
  isSignupPending: false,
  loginError: '',
  signupError: '',
  user: {},
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case AUTH_SET_USER:
      return { ...state, user: action.payload, isAuthenticated: true }
    case AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoginPending: false,
        isSignupPending: false,
        loginError: null,
        signupError: null,
        user: null,
      }

    case LOGIN_LOADING:
      return { ...state, isLoginPending: true }
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
        isLoginPending: false
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loginError: null,
        isLoginPending: false,
      }

    case SIGNUP_LOADING: return { ...state, isSignupPending: true }
    case SIGNUP_ERROR:
      return {
        ...state,
        signupError: action.payload,
        isSignupPending: false
      }
    case SIGNUP_SUCCESS:
      return {
        ...state,
        signupError: null,
        isSignupPending: false,
      }

    case LOGIN_CLEAR_ERROR:
      return { ...state, loginError: null }
    case SIGNUP_CLEAR_ERROR:
      return { ...state, signupError: null }
    default:
      return state;
  }
}

export default reducer;


// actions creators
export const logUserOut = () => ({ type: AUTH_LOGOUT });
export const setUser = (data: UserProps | null) => ({ type: AUTH_SET_USER, payload: data })
export const loginLoading = () => ({ type: LOGIN_LOADING })
export const loginSuccess = (data: UserProps) => ({ type: LOGIN_SUCCESS, payload: data })
export const loginError = (data: string) => ({ type: LOGIN_ERROR, payload: data })

export const signupLoading = () => ({ type: SIGNUP_LOADING })
export const signupSuccess = (data: any) => ({ type: SIGNUP_SUCCESS, payload: data })
export const signupError = (data: string) => ({ type: SIGNUP_ERROR, payload: data })

export const loginClearError = () => ({ type: LOGIN_CLEAR_ERROR })
export const signupClearError = () => ({ type: SIGNUP_CLEAR_ERROR })



// side effects
export const checkAuth = () => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/check-auth',
    formData: null,
    request: CHECK_AUTH_REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      console.log('CHECK AUTH: ', data)
      dispatch(setUser(data));
      dispatch({ type: CHECK_AUTH_SUCCESS });
      // history.push('/dashboard/bugs')
    },
    error: (dispatch: Dispatch, err: string) => {
      console.log(err)
      dispatch({ type: CHECK_AUTH_FAILURE });
    }
  }
})

export const signUserUp = (formData: FormData) => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/signup',
    formData,
    request: SIGNUP_LOADING,
    success: (dispatch: Dispatch, data: any) => {
      dispatch(signupSuccess(data));
      dispatch(signupClearError());
      history.push('/login')
    },
    error: (dispatch: Dispatch, err: string) => {
      dispatch(logUserOut())
      dispatch(signupClearError())
      dispatch(signupError(err))
    }
  }
})

export const loginUser = (formData: { name: string, email: string }) => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/login',
    formData,
    request: LOGIN_LOADING,
    success: (dispatch: Dispatch, data: any) => {
      console.log(data);
      dispatch(loginSuccess(data));
      dispatch(loginClearError());
      history.push('/dashboard/bugs')
    },
    error: (dispatch: Dispatch, err: string) => {
      dispatch(logUserOut())
      dispatch(loginClearError())
      dispatch(loginError(err))
    }
  }
})