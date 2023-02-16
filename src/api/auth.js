import refresh from './core/refresh';
import instance from './core/axios';

/**
 * 카카오 로그인
 * @param {string} code 카카오 인증 코드
 * @returns {response} response
 */
const kakaoLogin = async (code) => {
  const response = await instance.get(`/api/users/kakao/callback?code=${code}`);
  return response;
};

/**
 * 네이버 로그인
 * @param {string} code 네이버 인증 코드
 * @param {string} state 상태값
 * @returns {response} response
 */
const naverLogin = async (code, state) => {
  const response = await instance.get(`/api/users/naver/callback?code=${code}&state=${state}`);
  return response;
};

/**
 * 구글 로그인
 * @param {string} code 구글 인증 코드
 * @returns {response} response
 */
const googleLogin = async (code) => {
  const response = await instance.get(`/api/users/google/callback?code=${code}`);
  return response;
};

/**
 * 게스트 로그인
 * @param {string} nickname 닉네임
 * @returns {response} response
 */
const guestLogin = async (nickname, imgUrl) => {
  const response = await instance.post(`/api/users/guest`, { nickname, imgUrl });
  return response;
};

/**
 *
 * @returns
 */
const askToken = async () => {
  const response = await refresh.get('/api/users/issue/token');
  return response;
};

const authAPI = {
  kakaoLogin,
  naverLogin,
  googleLogin,
  guestLogin,
  askToken,
};

export default authAPI;
