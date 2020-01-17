import http from 'utils/httpInstance';
import { Method, AxiosError } from 'axios';
import { Dispatch } from 'redux';


interface ApiActionType {
  type: string;
  payload: {
    method: Method;
    url: string;
    formData?: any;
    request: (dispatch: Dispatch) => any;
    success: (dispatch: Dispatch, data: any) => any;
    error: (dispatch: Dispatch, err: AxiosError) => any;
  }
}

interface apiProps {
  getState: any;
  dispatch: Dispatch
}
const api = ({ getState, dispatch }: apiProps) => (next: any) => async (action: ApiActionType) => {
  if (action.type !== 'API') return next(action);

  const { request, success, error, method, url, formData } = action.payload;
  if (typeof request === 'function') {
    request(dispatch)
  } else {
    dispatch({ type: request });
  }
  try {
    const res = await http({
      method: method,
      url: url,
      data: formData
    });
    let { data } = res.data;
    if (typeof success === 'function') {
      success(dispatch, data);
    } else {
      dispatch({ type: success, payload: data });
    }
  } catch (err) {
    if (typeof error === 'function') {
      error(dispatch, err);
    } else {
      dispatch({ type: error, payload: err || 'Something went wrong' });
    }
  }
}

export default api;