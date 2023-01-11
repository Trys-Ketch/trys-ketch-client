import instance from './core/axios';

const getRoomList = async (page) => {
  const response = await instance.get(`/api/rooms?page=${page}`);
  return response;
};

const createRoom = async (title) => {
  const response = await instance.post(`/api/room`, { title });
  return response;
};

const enterRoom = async (id) => {
  const response = await instance.post(`/api/room/enter/${id}`);
  return response;
};

const exitRoom = async (id) => {
  const response = await instance.delete(`/api/room/${id}/exit`);
  return response;
};

const roomAPI = {
  getRoomList,
  createRoom,
  enterRoom,
  exitRoom,
};

export default roomAPI;
