import { Dispatch } from 'redux';
import socket from 'utils/socket';
import { CLEAR_ALL_ERRORS } from './errors';
import { ApiAction } from 'store/middlewares/apiMiddleware';
import { createAPIAction } from 'store/helpers';

// action
export const API = 'API';
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const UPDATE_LABEL_CHECKBOX = 'singlebug/UPDATE_LABEL_CHECKBOX';
export const CLEAR_LABEL_CHECKBOX = 'singlebug/CLEAR_LABEL_CHECKBOX';

export const FETCH_BUG = createAPIAction('singlebug/FETCH_BUG');
export const ADD_COMMENT = createAPIAction('singlebug/ADD_COMMENT');
export const TOGGLE_BUG = createAPIAction('singlebug/TOGGLE_BUG');
export const EDIT_LABELS = createAPIAction('singlebug/EDIT_LABELS');
export const EDIT_COMMENT = createAPIAction('singlebug/EDIT_COMMENT');
export const UPDATE_BUG = createAPIAction('singlebug/UPDATE_BUG');
export const UPDATE_REACTIONS = createAPIAction('singlebug/UPDATE_REACTIONS');
export const UPDATE_COMMENT_REACTIONS = createAPIAction('singlebug/UPDATE_COMMENT_REACTIONS');

export interface SinglebugReducerState {
  bug: any,
}

const DEFAULT_STATE: SinglebugReducerState = {
  bug: null,
}

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUG.SUCCESS:
      return { ...state, bug: action.payload }
    case ADD_COMMENT.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case EDIT_COMMENT.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          comments: action.payload
        }
      }
    case UPDATE_BUG.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          body: action.payload.body
        }
      }
    case TOGGLE_BUG.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          activities: action.payload.data,
          isOpen: action.payload.bug_state === 'open' ? true : false
        }
      }
    case EDIT_LABELS.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          labels: action.payload
        }
      }
    case UPDATE_REACTIONS.SUCCESS:
      return {
        ...state,
        bug: {
          ...state.bug,
          reactions: action.payload
        }
      }
    case UPDATE_COMMENT_REACTIONS.SUCCESS:
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
      dispatch({ type: FETCH_BUG.REQUEST });
    },
    success: FETCH_BUG.SUCCESS,
    error: FETCH_BUG.FAILURE
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
    request: ADD_COMMENT.REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({ type: ADD_COMMENT.SUCCESS, payload: data });
      socket.emit('send-notification', { message: 'Add comment' })
    },
    error: ADD_COMMENT.FAILURE
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
    request: EDIT_COMMENT.REQUEST,
    success: EDIT_COMMENT.SUCCESS,
    error: EDIT_COMMENT.FAILURE
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
    request: UPDATE_BUG.REQUEST,
    success: UPDATE_BUG.SUCCESS,
    error: UPDATE_BUG.FAILURE
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
    request: TOGGLE_BUG.REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({
        type: TOGGLE_BUG.SUCCESS,
        payload: { data, bug_state: state },
      });
      socket.emit('send-notification', { message: 'Bug Open/Closed' })
    },
    error: TOGGLE_BUG.FAILURE
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
    request: EDIT_LABELS.REQUEST,
    success: (dispatch: Dispatch, data: any) => {
      dispatch({ type: EDIT_LABELS.SUCCESS, payload: data });
    },
    error: (dispatch: Dispatch, err: string) => {
      dispatch(errorAction(EDIT_LABELS.FAILURE, err));
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
    success: UPDATE_REACTIONS.SUCCESS,
    error: UPDATE_REACTIONS.FAILURE,
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
    success: UPDATE_COMMENT_REACTIONS.SUCCESS,
    error: UPDATE_COMMENT_REACTIONS.FAILURE,
  }
});
