import axios from 'axios';
import auth from './authHelper';

const instance = axios.create({
  baseURL: '/',
});

const requestHandler = (request: any) => {
  // Modify request here
  request.headers['Authorization'] = `Bearer ${auth.getToken()}`
  console.log(request);
  return request
}

instance.interceptors.request.use(requestHandler)

export default instance;