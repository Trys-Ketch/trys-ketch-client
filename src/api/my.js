import instance from './core/axios';

// 이미지 좋아요
const imageLike = async (imageId) => {
  const response = await instance.post(`/api/image/like/${imageId}`);
  return response;
};

// 좋아요한 이미지 조회
const getLikedImages = async () => {
  const response = await instance.get(`/api/mypage/image-like`);
  return response;
};

// 좋아요한 이미지 취소
const cancelImageLike = async (imageId) => {
  const response = await instance.post(`/api/mypage/cancel-like/${imageId}`);
  return response;
};

// 닉네임 변경
const changeNickname = async (nickname) => {
  const response = await instance.patch(`/api/mypage/nickname`, nickname);
  return response;
};

const myAPI = {
  imageLike,
  getLikedImages,
  cancelImageLike,
  changeNickname,
};

export default myAPI;
