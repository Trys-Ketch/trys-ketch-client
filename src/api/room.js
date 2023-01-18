import instance from './core/axios';

const createRoom = async (title) => {
  const response = await instance.post(`/api/room`, { title });
  return response;
};

const enterRoom = async (code) => {
  const response = await instance.post(`/api/room/enter/${code}`);
  return response;
};

const exitRoom = async (id) => {
  const response = await instance.delete(`/api/room/${id}/exit`);
  return response;
};

const roomAPI = {
  createRoom,
  enterRoom,
  exitRoom,
};

export default roomAPI;
