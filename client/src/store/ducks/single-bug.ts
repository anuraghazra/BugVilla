import { Dispatch } from 'redux';
import { CLEAR_ALL_ERRORS } from './errors';
import { ApiAction } from 'store/middlewares/apiMiddleware';
import socket from 'utils/socket';

// action
export const API = 'API';
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const FETCH_BUG_REQUEST = 'singlebug/FETCH_BUG_REQUEST';
export const FETCH_BUG_SUCCESS = 'singlebug/FETCH_BUG_SUCCESS';
export const FETCH_BUG_FAILURE = 'singlebug/FETCH_BUG_FAILURE';

export const ADD_COMMENT_REQUEST = 'singlebug/ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'singlebug/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'singlebug/ADD_COMMENT_FAILURE';

export const TOGGLE_BUG_REQUEST = 'singlebug/TOGGLE_BUG_REQUEST';
export const TOGGLE_BUG_SUCCESS = 'singlebug/TOGGLE_BUG_SUCCESS';
export const TOGGLE_BUG_FAILURE = 'singlebug/TOGGLE_BUG_FAILURE';

export const EDIT_LABELS_REQUEST = 'singlebug/EDIT_LABELS_REQUEST';
export const EDIT_LABELS_SUCCESS = 'singlebug/EDIT_LABELS_SUCCESS';
export const EDIT_LABELS_FAILURE = 'singlebug/EDIT_LABELS_FAILURE';

export const EDIT_COMMENT_REQUEST = 'singlebug/EDIT_COMMENT_REQUEST';
export const EDIT_COMMENT_SUCCESS = 'singlebug/EDIT_COMMENT_SUCCESS';
export const EDIT_COMMENT_FAILURE = 'singlebug/EDIT_COMMENT_FAILURE';

export const UPDATE_BUG_REQUEST = 'singlebug/UPDATE_BUG_REQUEST';
export const UPDATE_BUG_SUCCESS = 'singlebug/UPDATE_BUG_SUCCESS';
export const UPDATE_BUG_FAILURE = 'singlebug/UPDATE_BUG_FAILURE';

export const UPDATE_REACTIONS_SUCCESS = 'singlebug/UPDATE_REACTIONS_SUCCESS';
export const UPDATE_REACTIONS_FAILURE = 'singlebug/UPDATE_REACTIONS_FAILURE';

export const UPDATE_COMMENT_REACTIONS_SUCCESS = 'singlebug/UPDATE_COMMENT_REACTIONS_SUCCESS';
export const UPDATE_COMMENT_REACTIONS_FAILURE = 'singlebug/UPDATE_COMMENT_REACTIONS_FAILURE';

export const UPDATE_LABEL_CHECKBOX = 'singlebug/UPDATE_LABEL_CHECKBOX';
export const CLEAR_LABEL_CHECKBOX = 'singlebug/CLEAR_LABEL_CHECKBOX';


export interface SinglebugReducerState {
  bug: any,
}

const DEFAULT_STATE: SinglebugReducerState = {
  bug: null,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUG_SUCCESS:
      return { ...state, bug: action.payload }
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case UPDATE_BUG_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          body: action.payload.body
        }
      }
    case TOGGLE_BUG_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          activities: action.payload.data,
          isOpen: action.payload.bug_state === 'open' ? true : false
        }
      }
    case EDIT_LABELS_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          labels: action.payload
        }
      }
    case UPDATE_REACTIONS_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          reactions: action.payload
        }
      }
    case UPDATE_COMMENT_REACTIONS_SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case CLEAR_BUG_DATA:
      return { ...state, bug: null }
    default:
      return state;
  }
}

export default reducer;

// action creators
const errorAction = (action: string, payload: any) => ({
  type: action,
  payload: payload || 'Something went wrong'
});

// side effects
export const fetchBugWithId = (bugId: number | string): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: `/api/bugs/${bugId}`,
    request: (dispatch: any) => {
      dispatch({ type: CLEAR_ALL_ERRORS });
      dispatch({ type: CLEAR_BUG_DATA });
      dispatch({ type: FETCH_BUG_REQUEST });
    },
    success: FETCH_BUG_SUCCESS,
    error: FETCH_BUG_FAILURE
  }
});

export const addComment = (
  bugId: number | string,
  formData: { body: string }
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/comments`,
    formData: formData,
    request: ADD_COMMENT_REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({ type: ADD_COMMENT_SUCCESS, payload: data });
      socket.emit('send-notification', { message: 'Add comment' })
    },
    error: ADD_COMMENT_FAILURE
  }
});

export const editComment = (
  bugId: number | string,
  commentId: string,
  formData: { body: string }
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/comments/${commentId}`,
    formData: formData,
    request: EDIT_COMMENT_REQUEST,
    success: EDIT_COMMENT_SUCCESS,
    error: EDIT_COMMENT_FAILURE
  }
});

export const updateBug = (
  bugId: number | string,
  formData: { body: string }
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}`,
    formData: formData,
    request: UPDATE_BUG_REQUEST,
    success: UPDATE_BUG_SUCCESS,
    error: UPDATE_BUG_FAILURE
  }
});

export const openOrCloseBug = (
  bugId: number | string,
  state: string
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/${state}`,
    request: TOGGLE_BUG_REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({
        type: TOGGLE_BUG_SUCCESS,
        payload: { data, bug_state: state },
      });
      socket.emit('send-notification', { message: 'Bug Open/Closed' })
    },
    error: TOGGLE_BUG_FAILURE
  }
});

export const editLabels = (
  bugId: number | string,
  labelData: string[]
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/labels`,
    formData: { labels: labelData },
    request: EDIT_LABELS_REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({ type: EDIT_LABELS_SUCCESS, payload: data });
    },
    error: (dispatch: Dispatch, err: string) => {
      dispatch(errorAction(EDIT_LABELS_FAILURE, err));
    }
  }
});

export const addReferences = (
  bugId: number | string,
  references: string[]
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/references`,
    formData: { references },
    request: () => { },
    success: () => {
      socket.emit('send-notification', { message: 'Bugs Referenced' })
    },
    error: () => { },
  }
});

export const mentionPeople = (
  bugId: number | string,
  mentions: string[]
): ApiAction => ({
  type: API,
  payload: {
    method: 'POST',
    url: `/api/notifications/mentions/${bugId}`,
    formData: { mentions },
    request: () => { },
    success: () => {
      socket.emit('send-notification', { message: 'Users Mentioned' })
    },
    error: () => { },
  }
});

// add or remove reactions from bug (bug.body)
export const addOrRemoveReacts = (
  bugId: number | string,
  emoji: string
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/reactions`,
    formData: { emoji },
    request: () => { },
    success: UPDATE_REACTIONS_SUCCESS,
    error: UPDATE_REACTIONS_FAILURE,
  }
});

// add or remove reactions from comments
export const addOrRemoveReactsComment = (
  bugId: number | string,
  commentId: string,
  emoji: string
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/comments/${commentId}/reactions`,
    formData: { emoji },
    request: () => { },
    success: UPDATE_COMMENT_REACTIONS_SUCCESS,
    error: UPDATE_COMMENT_REACTIONS_FAILURE,
  }
});
