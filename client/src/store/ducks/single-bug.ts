import { normalize } from 'normalizr';
import socket from 'utils/socket';
import cloneDeep from 'lodash/cloneDeep';

import { ApiAction } from 'store/middlewares/apiMiddleware';
import { CLEAR_ALL_ERRORS } from './errors';
import { createAPIAction } from 'store/helpers';
import { bugSchema } from 'store/schemas';
import { batch } from 'react-redux';

// action
export const API = 'API';
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';
export const FETCH_BUG = createAPIAction('singlebug/FETCH_BUG');
export const TOGGLE_BUG = createAPIAction('singlebug/TOGGLE_BUG');
export const EDIT_LABELS = createAPIAction('singlebug/EDIT_LABELS');
export const UPDATE_BUG = createAPIAction('singlebug/UPDATE_BUG');
export const ADD_COMMENT = createAPIAction('singlebug/ADD_COMMENT');
export const EDIT_COMMENT = createAPIAction('singlebug/EDIT_COMMENT');
export const UPDATE_BUG_REACTIONS = createAPIAction(
  'singlebug/UPDATE_BUG_REACTIONS'
);
export const UPDATE_COMMENT_REACTIONS = createAPIAction(
  'singlebug/UPDATE_COMMENT_REACTIONS'
);
export const COMMENT_REACTIONS_OPTIMISTIC =
  'singlebug/COMMENT_REACTIONS_OPTIMISTIC';

export interface SinglebugReducerState {
  entities: {
    comments: {
      [x: string]: any;
    };
  };
  result: {
    activities: any[];
    body: string;
    title: string;
    bugId: number;
    labels: any[];
    comments: string[];
    reactions: any[];
    references: any[];
    date_opened: string;
    author: any;
    [x: string]: any;
  };
}
const DEFAULT_STATE: SinglebugReducerState = {
  entities: {
    comments: {},
  },
  result: {
    activities: [],
    body: '',
    title: '',
    bugId: 0,
    labels: [],
    comments: [],
    reactions: [],
    references: [],
    date_opened: '',
    author: { username: '' },
  },
};

// saving the payload of OPTIMISTIC Reaction update
// for handling fallback
let selectedReaction: { emoji: string; userData: any } | null = null;
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUG.SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    //  return { ...state, entities: merge({}, state.entities, action.payload.entities) }
    case EDIT_COMMENT.SUCCESS:
    case ADD_COMMENT.SUCCESS:
      return {
        ...state,
        entities: {
          ...state.entities,
          comments: {
            ...state.entities.comments,
            [action.payload.id]: {
              ...action.payload,
            },
          },
        },
      };
    case COMMENT_REACTIONS_OPTIMISTIC:
    case UPDATE_COMMENT_REACTIONS.FAILURE:
      if (action.type === COMMENT_REACTIONS_OPTIMISTIC) {
        selectedReaction = action.payload;
        console.log(selectedReaction);
      }
      let { emoji, userData } = action.payload;
      let comment = toggleCommentReaction(
        state.entities.comments[action.payload.commentId],
        { emoji, userData }
      );

      return {
        ...state,
        entities: {
          ...state.entities,
          comments: {
            ...state.entities.comments,
            [action.payload.commentId]: {
              ...comment,
            },
          },
        },
      };
    case UPDATE_BUG.SUCCESS:
      return {
        ...state,
        result: { ...state.result, body: action.payload },
      };
    case UPDATE_BUG_REACTIONS.SUCCESS:
      return {
        ...state,
        result: { ...state.result, reactions: action.payload },
      };
    case EDIT_LABELS.SUCCESS:
      return {
        ...state,
        result: { ...state.result, labels: action.payload },
      };
    case TOGGLE_BUG.SUCCESS:
      return {
        ...state,
        result: {
          ...state.result,
          activities: action.payload.data,
          isOpen: action.payload.bug_state === 'open' ? true : false,
        },
      };
    case CLEAR_BUG_DATA:
      return {};
    default:
      // if (action?.payload?.entities?.comments) {
      //   return merge({}, state, action?.payload?.entities?.comments);
      // }
      return state;
  }
};
export default reducer;

// side effects

/**
 * @description optimistic update of reactions
 */
const toggleCommentReaction = (
  inputComment: any,
  payload: { emoji: string; userData: any }
) => {
  let comment = cloneDeep(inputComment);
  if (comment.reactions.length < 1) {
    comment.reactions.push({
      emoji: payload.emoji,
      users: [payload.userData],
    });
    return comment;
  }
  comment.reactions.forEach((react: any, index: number) => {
    let isEmojiPresent = comment.reactions.some(
      (e: any) => e.emoji === payload.emoji
    );
    if (!isEmojiPresent) {
      comment.reactions.push({
        emoji: payload.emoji,
        users: [payload.userData],
      });
    }
    // emoji mismatch
    if (react.emoji !== payload.emoji) return;
    let indexOfUser = react.users.findIndex(
      (u: any) => u.username === payload.userData.username
    );

    if (indexOfUser > -1) {
      react.users.splice(indexOfUser, 1);
    } else {
      react.emoji = payload.emoji;
      react.users = [payload.userData];
    }

    // if users array is empty remove the reaction from list
    if (react.users.length < 1) comment.reactions.splice(index, 1);
  });
  return comment;
};

export const fetchBugWithId = (bugId: number | string): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: `/api/bugs/${bugId}`,
  },
  onRequest: (dispatch: any) => {
    batch(() => {
      dispatch({ type: CLEAR_ALL_ERRORS });
      dispatch({ type: CLEAR_BUG_DATA });
      dispatch({ type: FETCH_BUG.REQUEST });
    });
  },
  onSuccess: (dispatch: any, data) => {
    dispatch({
      type: FETCH_BUG.SUCCESS,
      payload: normalize(data, bugSchema),
    });
  },
  onFailure: FETCH_BUG.FAILURE,
});

//#region
export const addComment = (
  bugId: number | string,
  formData: { body: string }
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/comments`,
    formData: formData,
  },
  onRequest: ADD_COMMENT.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: ADD_COMMENT.SUCCESS, payload: data });
    socket.emit('send-notification', { message: 'Add comment' });
  },
  onFailure: ADD_COMMENT.FAILURE,
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
  },
  onRequest: EDIT_COMMENT.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: EDIT_COMMENT.SUCCESS, payload: data });
    socket.emit('send-notification', { message: 'Add comment' });
  },
  onFailure: EDIT_COMMENT.FAILURE,
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
  },
  onRequest: UPDATE_BUG.REQUEST,
  onSuccess: UPDATE_BUG.SUCCESS,
  onFailure: UPDATE_BUG.FAILURE,
});

export const openOrCloseBug = (
  bugId: number | string,
  state: string
): ApiAction => ({
  type: API,
  payload: {
    method: 'PATCH',
    url: `/api/bugs/${bugId}/${state}`,
  },
  onRequest: TOGGLE_BUG.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({
      type: TOGGLE_BUG.SUCCESS,
      payload: { data, bug_state: state },
    });
    socket.emit('send-notification', { message: 'Bug Open/Closed' });
  },
  onFailure: TOGGLE_BUG.FAILURE,
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
  },
  onRequest: EDIT_LABELS.REQUEST,
  onSuccess: (dispatch, data) => {
    dispatch({ type: EDIT_LABELS.SUCCESS, payload: data });
  },
  onFailure: EDIT_LABELS.FAILURE,
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
  },
  onSuccess: () => {
    socket.emit('send-notification', { message: 'Bugs Referenced' });
  },
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
  },
  onSuccess: () => {
    socket.emit('send-notification', { message: 'Users Mentioned' });
  },
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
  },
  onSuccess: UPDATE_BUG_REACTIONS.SUCCESS,
  onFailure: UPDATE_BUG_REACTIONS.FAILURE,
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
  },
  onSuccess: (dispatch, data: any) => {
    dispatch({ type: UPDATE_COMMENT_REACTIONS.SUCCESS, payload: data });
  },
  onFailure: dispatch => {
    // on failure remove the reaction
    dispatch({
      type: UPDATE_COMMENT_REACTIONS.FAILURE,
      payload: selectedReaction,
    });
  },
});
//#endregion
