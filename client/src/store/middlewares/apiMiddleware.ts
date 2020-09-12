import http from 'utils/httpInstance';
import { Method } from 'axios';
import { Dispatch } from 'redux';

export interface ApiAction {
  type: 'API';
  payload: {
    method: Method;
    url: string;
    formData?: any;
  };
  onRequest?: string | ((dispatch: Dispatch) => void);
  onSuccess?: string | ((dispatch: Dispatch, data: any) => void);
  onFailure?: string | ((dispatch: Dispatch, err: string) => void);
  [x: string]: any;
}

interface apiProps {
  getState: any;
  dispatch: Dispatch;
}
const api = ({ getState, dispatch }: apiProps) => (next: any) => async (
  action: ApiAction
) => {
  if (action.type !== 'API') return next(action);

  const noop = () => {};
  const {
    payload: { method, url, formData },
    onRequest = noop,
    onSuccess = noop,
    onFailure = noop,
  } = action;

  if (typeof onRequest === 'function') {
    onRequest(dispatch);
  } else {
    dispatch({ type: onRequest });
  }
  try {
    const res = await http({
      method: method,
      url: url,
      data: formData,
    });
    let { data } = res.data;
    // TODO: normalize this res.data.data causing
    // inconsistency because server is sending with wrapped {data: ...}
    if (typeof onSuccess === 'function') {
      onSuccess(dispatch, data);
    } else {
      dispatch({ type: onSuccess, payload: data });
    }
  } catch (err) {
    if (typeof onFailure === 'function') {
      onFailure(dispatch, err);
    } else {
      dispatch({ type: onFailure, payload: err || 'Something went wrong' });
    }
    return Promise.reject(err);
  }
};

export default api;
