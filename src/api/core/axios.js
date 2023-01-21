import axios from 'axios';
import { getCookie } from '../../utils/cookie';
import { store } from '../../app/configStore';

// 인스턴스 생성
const instance = axios.create({
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

// TODO - 로그인 만료 처리 interceptors
// Unauthorized Error 처리
// axios.interceptors.response.use((error) => {
//   if (error.response.status === 401) {
//     useToast('로그인이 만료되었습니다.', 'error');
//     window.location.href('/login');
//   }
// });

export default instance;
