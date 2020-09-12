import { Dispatch } from 'redux';
import socket from 'utils/socket';
import { CLEAR_ALL_ERRORS } from './errors';
import { ApiAction } from 'store/middlewares/apiMiddleware';
import { createAPIAction } from 'store/helpers';
import { toggleArrayItem } from 'utils';
import { normalize, schema } from 'normalizr';
import { commentSchema, bugSchema } from 'store/schemas';
// action
export const API = 'API';
export const CLEAR_BUG_DATA = 'singlebug/CLEAR_BUG_DATA';

export const FETCH_BUG = createAPIAction('singlebug/FETCH_BUG');
export const TOGGLE_BUG = createAPIAction('singlebug/TOGGLE_BUG');
export const EDIT_LABELS = createAPIAction('singlebug/EDIT_LABELS');
export const UPDATE_BUG = createAPIAction('singlebug/UPDATE_BUG');
export const UPDATE_REACTIONS = createAPIAction('singlebug/UPDATE_REACTIONS');
export const ADD_COMMENT = createAPIAction('singlebug/ADD_COMMENT');
export const EDIT_COMMENT = createAPIAction('singlebug/EDIT_COMMENT');
export const UPDATE_COMMENT_REACTIONS = createAPIAction(
  'singlebug/UPDATE_COMMENT_REACTIONS'
);
export const COMMENT_REACTIONS_OPTI = 'singlebug/COMMENT_REACTIONS_OPTI';

export interface SinglebugReducerState {
  result?: {
    [x: string]: any;
  };
  entities?: {
    [x: string]: any;
  };
}

const DEFAULT_STATE: SinglebugReducerState = {};

// reducers
const reducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case FETCH_BUG.SUCCESS:
      // let normalizedComments = normalize(action.payload, { comments: [commentSchema] })
      return {
        ...state,
        ...action.payload,
      };
    case ADD_COMMENT.SUCCESS:
      // let norm1 = normalize(action.payload, [commentSchema])
      return {
        ...state,
        entities: {
          reactions: {
            ...state?.entities?.reactions,
          },
          comments: {
            ...state?.entities?.comments,
          },
        },
        result: {
          ...state.result,
          comments: [
            ...state?.result?.comments,
            action.payload[action.payload.length - 1].id,
          ],
        },
      };
    case EDIT_COMMENT.SUCCESS:
      // let norm = normalize(action.payload[0], commentSchema)
      return {
        ...state,
        entities: {
          comments: {
            ...state?.entities?.comments,
          },
        },
      };
    case UPDATE_BUG.SUCCESS:
      return {
        ...state,
        result: {
          ...state.result,
          body: action.payload.body,
        },
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
    case EDIT_LABELS.SUCCESS:
      return {
        ...state,
        result: {
          ...state.result,
          labels: action.payload,
        },
      };
    case UPDATE_REACTIONS.SUCCESS:
      return {
        ...state,
        reactions: action.payload,
      };
    case UPDATE_COMMENT_REACTIONS.SUCCESS:
      return {
        ...state,
        comments: action.payload,
      };
    // optimistic
    // {user:{
    //   username: string;
    //   id: string;
    //   name: string;
    // }}
    case COMMENT_REACTIONS_OPTI:
      return {
        ...state,
        // comments: state?.result.comments.map((comment: any) => {
        //   if (comment.id !== action.payload.commentId) {
        //     // This isn't the item we care about - keep it as-is
        //     return comment
        //   }

        //   function addReaction(payload: {
        //     emoji: string;
        //     user: any;
        //   }) {
        //     comment.reactions.forEach((react: any) => {
        //       let isEmojiPresent = comment.reactions.some(
        //         (e: any) => e.emoji === payload.emoji
        //       );
        //       if (!isEmojiPresent) {
        //         // emoji isn't present
        //         comment.reactions.push({
        //           emoji: payload.emoji,
        //           users: [payload.user]
        //         });
        //       }
        //       if (react.emoji !== payload.emoji) {
        //         // emoji mismatch
        //         return;
        //       }
        //       react.emoji = payload.emoji;
        //       react.users = toggleArrayItem(react.users, payload.user);
        //       if (react.users.length < 1) {
        //         // users is empty remove the reaction
        //         comment.reactions.splice(comment.reactions.indexOf(react), 1)
        //       }
        //     });
        //   }

        //   addReaction({ emoji: action.payload.emoji, user: action.payload.optimisticData })

        //   return comment;
        // })
      };
    case CLEAR_BUG_DATA:
      return { ...state, bug: null };
    default:
      return state;
  }
};

export default reducer;

// side effects
export const fetchBugWithId = (bugId: number | string): ApiAction => ({
  type: API,
  payload: {
    method: 'GET',
    url: `/api/bugs/${bugId}`,
  },
  onRequest: (dispatch: any) => {
    dispatch({ type: CLEAR_ALL_ERRORS });
    dispatch({ type: CLEAR_BUG_DATA });
    dispatch({ type: FETCH_BUG.REQUEST });
  },
  onSuccess: (dispatch: any, data) => {
    let norm = normalize(data, [bugSchema]);
    console.log(norm);
    dispatch({
      type: FETCH_BUG.SUCCESS,
      payload: norm,
    });
  },
  onFailure: FETCH_BUG.FAILURE,
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
  },
  onRequest: ADD_COMMENT.REQUEST,
  onSuccess: (dispatch: Dispatch, data: any) => {
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
  onSuccess: EDIT_COMMENT.SUCCESS,
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
  onSuccess: (dispatch: Dispatch, data: any) => {
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
  onSuccess: (dispatch: Dispatch, data: any) => {
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
  onSuccess: UPDATE_REACTIONS.SUCCESS,
  onFailure: UPDATE_REACTIONS.FAILURE,
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
  onSuccess: UPDATE_COMMENT_REACTIONS.SUCCESS,
  onFailure: UPDATE_COMMENT_REACTIONS.FAILURE,
});
