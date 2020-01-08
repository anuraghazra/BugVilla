import axios from 'axios';
import auth from './authHelper';

const instance = axios.create({
  baseURL: '/'
});

const requestHandler = (config: any) => {
  // Modify config here
  if (auth.getToken()) {
    config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
  }
  return config;
};

instance.interceptors.request.use(requestHandler, (error: any) => {
  // handle error
  if (error.response) {
    console.log(error.response);
    console.log(error.response.data.message);
  }
});

export default instance;
