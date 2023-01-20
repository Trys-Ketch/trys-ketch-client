import instance from './core/axios';

const getRoomList = async (page) => {
  const response = await instance.get(`/api/rooms?page=${page}`);
  return response;
};

const createRoom = async (title) => {
  const response = await instance.post(`/api/room`, { title });
  return response;
};

const enterRoom = async (code) => {
  const response = await instance.post(`/api/room/enter/${code}`);
  return response;
};

const getRoomDetail = async (roomId) => {
  const response = await instance.get(`/api/room/${roomId}`);
  return response;
};

// 처리 방식 미정
// const exitRoom = async (id) => {
//   const response = await instance.delete(`/api/room/exit/${id}`);
//   return response;
// };

const roomAPI = {
  getRoomList,
  createRoom,
  enterRoom,
  getRoomDetail,
  // exitRoom,
};

export default roomAPI;
