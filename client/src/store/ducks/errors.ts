export const CLEAR_ALL_ERRORS = 'CLEAR_ALL_ERRORS';

const errorsReducer = (state = {}, action: any) => {
  const { type, payload } = action;
  if (type === CLEAR_ALL_ERRORS) return {};
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches) return state;
  const [, requestName, requestState] = matches;

  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]: requestState === 'FAILURE' ? payload : '',
  };
};

export default errorsReducer;
