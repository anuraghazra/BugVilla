import http from 'httpInstance';
import auth from 'utils/authHelper';

// action
export const CLEAR_ERROR = 'auth/CLEAR_ERROR';
export const AUTH_SUCCESS = 'login/AUTH_SUCCESS';
export const AUTH_ERROR = 'login/AUTH_ERROR';
export const AUTH_LOADING = 'login/AUTH_LOADING';
export const SIGNUP_SUCCESS = 'signup/SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'signup/SIGNUP_ERROR';


const DEFAULT_STATE = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case AUTH_LOADING:
      return { ...state, isLoading: true }
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
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
    case SIGNUP_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
      }
    case CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state;
  }
}

export default reducer;


// actions creators
export const userLoadingAction = () => ({ type: AUTH_LOADING })
export const authErrorAction = (data: any) => ({ type: AUTH_ERROR, payload: data })
export const userLoginSuccess = (data: any) => ({ type: AUTH_SUCCESS, payload: data })
export const userSignupSuccess = (data: any) => ({ type: SIGNUP_SUCCESS, payload: data })
export const clearError = () => ({ type: CLEAR_ERROR })

// side effects
export const signUserUp = (formData: FormData, history: any) => {
  return async (dispatch: any) => {
    dispatch(userLoadingAction());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/signup',
        data: formData,
      });
      let { data } = res.data;
      dispatch(userSignupSuccess(data));
      history.push('/login')
    }
    catch (err) {
      dispatch(authErrorAction(err.response.data.error))
    }
  }
}

// side effects
export const loginUser = (formData: { name: string, email: string }, history: any) => {
  return async (dispatch: any) => {
    dispatch(userLoadingAction());

    try {
      const res = await http({
        method: 'POST',
        url: '/api/user/login',
        data: formData,
      });
      const { data } = res.data;
      dispatch(userLoginSuccess(data));
      auth.setToken(data.token)
      history.push('/bugs')
    }
    catch (err) {
      dispatch(authErrorAction(err.response.data.error))
    }
  }
}
