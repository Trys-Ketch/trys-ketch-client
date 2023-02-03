import instance from './core/axios';

// 이미지 좋아요 토글
const imageToggleLike = async (imageId) => {
  const response = await instance.post(`/api/image/like/${imageId}`);
  return response;
};

// 뱃지 조회
const getBadge = async () => {
  const response = await instance.get(`/api/mypage/badge`);
  return response;
};

// 좋아요한 이미지 페이지 조회
const getLikedImages = async (page) => {
  const response = await instance.get(`/api/mypage/image-like?page=${page}`);
  return response;
};

// 프로필 변경
const changeProfile = async (nickname, imgUrl) => {
  const response = await instance.patch(`/api/mypage/profile`, { nickname, imgUrl });
  return response;
};

const myAPI = {
  imageToggleLike,
  getBadge,
  getLikedImages,
  changeProfile,
};

export default myAPI;
