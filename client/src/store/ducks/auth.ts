import http from 'httpInstance';
import auth from 'utils/authHelper';

// action
export const LOGIN_SUCCESS = 'login/SUCCESS';
export const LOGIN_ERROR = 'login/ERROR';
export const LOGIN_LOADING = 'login/LOADING';
export const LOGIN_CLEAR_ERROR = 'login/CLEAR_ERROR';

export const SIGNUP_SUCCESS = 'signup/SUCCESS';
export const SIGNUP_ERROR = 'signup/ERROR';
export const SIGNUP_LOADING = 'signup/LOADING';
export const SIGNUP_CLEAR_ERROR = 'signup/CLEAR_ERROR';


const DEFAULT_STATE = {
  isAuthenticated: false,
  isLoginPending: false,
  isSignupPending: false,
  loginError: null,
  signupError: null,
  user: null,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
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
export const loginLoading = () => ({ type: LOGIN_LOADING })
export const loginSuccess = (data: any) => ({ type: LOGIN_SUCCESS, payload: data })
export const loginError = (data: any) => ({ type: LOGIN_ERROR, payload: data })

export const signupLoading = () => ({ type: SIGNUP_LOADING })
export const signupSuccess = (data: any) => ({ type: SIGNUP_SUCCESS, payload: data })
export const signupError = (data: any) => ({ type: SIGNUP_ERROR, payload: data })

export const loginClearError = () => ({ type: LOGIN_CLEAR_ERROR })
export const signupClearError = () => ({ type: SIGNUP_CLEAR_ERROR })

// side effects
export const signUserUp = (formData: FormData, history: any) => {
  return async (dispatch: any) => {
    dispatch(signupLoading());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/signup',
        data: formData,
      });
      let { data } = res.data;
      dispatch(signupSuccess(data));
      dispatch(signupClearError());
      history.push('/login')
    }
    catch (err) {
      dispatch(signupError(err.response.data.error))
    }
  }
}

// side effects
export const loginUser = (formData: { name: string, email: string }, history: any) => {
  return async (dispatch: any) => {
    dispatch(loginLoading());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/login',
        data: formData,
      });
      const { data } = res.data;
      dispatch(loginSuccess(data));
      dispatch(loginClearError());
      auth.setToken(data.token)
      history.push('/bugs')
    }
    catch (err) {
      dispatch(loginError(err.response.data.error))
    }
  }
}
