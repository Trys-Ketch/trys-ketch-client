import instance from './core/axios';

// 이미지 좋아요 토글
const imageToggleLike = async (imageId) => {
  const response = await instance.post(`/api/image/like/${imageId}`);
  return response;
};

// 좋아요한 이미지 조회
const getLikedImages = async () => {
  const response = await instance.get(`/api/mypage/image-like`);
  return response;
};

// 프로필 변경
const changeProfile = async (nickname, imgUrl) => {
  const response = await instance.patch(`/api/mypage/profile`, { nickname, imgUrl });
  return response;
};

const myAPI = {
  imageToggleLike,
  getLikedImages,
  changeProfile,
};

export default myAPI;
