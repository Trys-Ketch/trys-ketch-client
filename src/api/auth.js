import instance from './core/axios';

// 카카오 로그인
// code: 카카오 인증 코드
const kakaoLogin = async (code) => {
  const response = await instance.get(`/api/users/kakao/callback?code=${code}`);
  return response;
};

const authAPI = {
  kakaoLogin,
};

export default authAPI;
