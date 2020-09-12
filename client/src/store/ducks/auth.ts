import history from 'utils/history';
import { Dispatch } from 'redux';
import { API } from './single-bug';
import { ApiAction } from 'store/middlewares/apiMiddleware';
import { createAPIAction } from 'store/helpers';
import { CLEAR_ALL_ERRORS } from './errors';

// action
export const AUTH_LOGOUT = 'auth/LOGOUT';
export const AUTH_SET_USER = 'auth/SET_USER';

export const CHECK_AUTH = createAPIAction('auth/CHECK_AUTH');
export const UPLOAD_AVATAR = createAPIAction('user/UPLOAD_AVATAR');
export const UPDATE_BIO = createAPIAction('user/UPDATE_BIO');

export const LOGIN = createAPIAction('user/LOGIN');
export const SIGNUP = createAPIAction('user/SIGN_UP');
export const LOGIN_CLEAR_ERROR = 'login/CLEAR_ERROR';
export const SIGNUP_CLEAR_ERROR = 'signup/CLEAR_ERROR';

export interface UserProps {
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  id?: string;
}
export interface AuthReducerState {
  isAuthenticated: boolean;
  user: UserProps;
}

const DEFAULT_STATE: AuthReducerState = {
  isAuthenticated: false,
  user: {},
};

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case CHECK_AUTH.SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true };
    case AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case LOGIN.SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case UPDATE_BIO.SUCCESS:
      return { ...state, user: { ...state.user, bio: action.payload } };
    default:
      return state;
  }
};

export default reducer;

// actions creators
export const logUserOut = () => ({ type: AUTH_LOGOUT });

// side effects
export const checkAuth = (): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/check-auth',
    formData: null,
  },
  onRequest: CHECK_AUTH.REQUEST,
  onSuccess: CHECK_AUTH.SUCCESS,
  onFailure: CHECK_AUTH.FAILURE,
});

export const signUserUp = (formData: FormData): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/signup',
    formData,
  },
  onRequest: SIGNUP.REQUEST,
  onSuccess: (dispatch: Dispatch, data: any) => {
    dispatch({ type: CLEAR_ALL_ERRORS });
    dispatch({ type: SIGNUP.SUCCESS });
    history.push(`/?signedup=true&email=${data.email}`);
  },
  onFailure: (dispatch: Dispatch, err: string) => {
    dispatch({ type: SIGNUP.FAILURE, payload: err });
    dispatch({ type: AUTH_LOGOUT });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});

export const loginUser = (formData: {
  name: string;
  email: string;
}): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: '/api/user/login',
    formData,
  },
  onRequest: LOGIN.REQUEST,
  onSuccess: (dispatch: Dispatch, data: any) => {
    dispatch({ type: LOGIN.SUCCESS, payload: data });
    dispatch({ type: CLEAR_ALL_ERRORS });
    history.push('/dashboard/bugs');
  },
  onFailure: (dispatch: Dispatch, err: string) => {
    dispatch({ type: LOGIN.FAILURE, payload: err });
    dispatch({ type: AUTH_LOGOUT });
    dispatch({ type: CLEAR_ALL_ERRORS });
  },
});

export const updateUserAvatar = (formData: any): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: '/api/user/me/avatar/upload',
    formData,
  },
  onRequest: UPLOAD_AVATAR.REQUEST,
  onSuccess: UPLOAD_AVATAR.SUCCESS,
  onFailure: UPLOAD_AVATAR.FAILURE,
});

export const updateUserBio = (formData: { bio: string }): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: '/api/user/me/bio',
    formData,
  },
  onRequest: UPDATE_BIO.REQUEST,
  onSuccess: UPDATE_BIO.SUCCESS,
  onFailure: UPDATE_BIO.FAILURE,
});
