import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/',
});

const requestHandler = (request: any) => {
  console.log(request)
  // Modify request here
  // request.headers['X-CodePen'] = 'https://codepen.io/teroauralinna/full/vPvKWe'
  return request
}

instance.interceptors.request.use(requestHandler)

export default instance;