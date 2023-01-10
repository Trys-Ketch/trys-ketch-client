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
 * 게스트 로그인
 * @param {string} nickname 닉네임
 * @returns {response} response
 */
const guestLogin = async (nickname) => {
  const response = await instance.post(`/api/users/guest`, { nickname });
  return response;
};

const authAPI = {
  kakaoLogin,
  guestLogin,
};

export default authAPI;
