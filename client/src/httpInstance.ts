import axios from 'axios';
import auth from './utils/authHelper';

const instance = axios.create({
  baseURL: 'http://localhost:5000/',
});

const requestHandler = (request: any) => {
  // Modify request here
  request.headers['Authorization'] = `Bearer ${auth.getToken()}`
  console.log(request)
  return request
}

instance.interceptors.request.use(requestHandler)

export default instance;