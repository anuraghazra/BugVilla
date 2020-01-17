import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import auth from './authHelper';

const instance: AxiosInstance = axios.create({
  baseURL: '/'
});

const requestHandler = (config: AxiosRequestConfig) => {
  // Modify config here
  if (auth.getToken()) {
    config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
  }
  return config;
};

instance.interceptors.request.use(requestHandler, (error: AxiosError) => {
  // handle error
  console.log(error.response);
});

export default instance;
