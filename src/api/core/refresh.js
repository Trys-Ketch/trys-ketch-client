import axios from 'axios';

const refresh = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

refresh.interceptors.request.use((config) => {
  config.headers.Authorization = null;
  return config;
});

refresh.defaults.timeout = 2500;

export default refresh;
