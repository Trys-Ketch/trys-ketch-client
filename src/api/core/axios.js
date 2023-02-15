import axios from 'axios';
import { getCookie, setCookie } from '../../utils/cookie';
import { store } from '../../app/configStore';
import { toast } from '../../components/toast/ToastProvider';

// 인스턴스 생성
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const refresh = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// 요청 타임아웃
instance.defaults.timeout = 2500;

// 인스턴스 request header Authorization 설정
instance.interceptors.request.use((config) => {
  const { member } = store.getState().login;
  if (config.headers === undefined) return;
  if (member === 'guest') {
    const token = getCookie('guest');
    config.headers.guest = token;
  } else {
    const token = getCookie();
    config.headers.Authorization = `${token}`;
  }
  return config;
});

refresh.interceptors.request.use((config) => {
  config.headers.Authorization = null;
  return config;
});

// TODO - 로그인 만료 처리 interceptors
// Unauthorized Error 처리
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config } = error;
    if (error.response.status === 401) {
      const data = await refresh.get('/api/users/issue/token');
      setCookie(data.headers.authorization);
      config.headers.Authorization = data.headers.authorization;
      return axios(config);
    }
  },
);

export default instance;
