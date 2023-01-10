import instance from './core/axios';

/**
 * 랜덤 닉네임 발급
 * @returns {response} {statusCode:Number, message:String}
 */
const getRandomNickname = async () => {
  const response = await instance.get(`/api/users/random-nick`);
  return response;
};

const userAPI = {
  getRandomNickname,
};

export default userAPI;
