import instance from './core/axios';

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

const roomAPI = {
  createRoom,
  enterRoom,
  getRoomDetail,
};

export default roomAPI;
