import axios from 'axios';
import { toast } from '../../components/toast/ToastProvider';
import { delCookie } from '../../utils/cookie';

const refresh = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

refresh.interceptors.request.use((config) => {
  config.headers.Authorization = null;
  return config;
});

refresh.defaults.timeout = 2500;

export const setupRefreshResponseInterceptor = (navigate, closeModal) => {
  refresh.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 403) {
        closeModal();
        navigate('/login');
        delCookie();
        toast.error('로그인이 만료되었습니다.');
      }
    },
  );
};

export default refresh;
