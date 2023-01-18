import instance from './core/axios';

/**
 * 랜덤 닉네임 발급
 * @returns {response} {statusCode:Number, message:String}
 */
const getRandomNickname = async () => {
  const response = await instance.get(`/api/users/random-nick`);
  return response;
};

/**
 * 랜덤 프로필 이미지 발급
 * @returns {response} {statusCode:Number, message:Url}
 */
const getRandomImage = async () => {
  const response = await instance.get(`/api/users/random-img`);
  return response;
};

const userAPI = {
  getRandomNickname,
  getRandomImage,
};

export default userAPI;
