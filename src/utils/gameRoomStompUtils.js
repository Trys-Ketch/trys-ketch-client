import { SOCKET_MSG, SOCKET_PUB_DEST } from '../helper/constants';

function toggleReady(socket, id) {
  socket.send(JSON.stringify({ type: SOCKET_MSG.READY, room: id }));
}

function start(ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: SOCKET_PUB_DEST.START_GAME,
    body: JSON.stringify({ roomId: id, token }),
  });
}

function sendDifficulty(difficulty, ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: SOCKET_PUB_DEST.DIFFICULTY,
    body: JSON.stringify({ roomId: id, token, difficulty }),
  });
}

function increaseTime(ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: SOCKET_PUB_DEST.INCREASE_TIME,
    body: JSON.stringify({ roomId: id, token }),
  });
}

function decreaseTime(ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: SOCKET_PUB_DEST.DECREASE_TIME,
    body: JSON.stringify({ roomId: id, token }),
  });
}

export { toggleReady, start, sendDifficulty, increaseTime, decreaseTime };
