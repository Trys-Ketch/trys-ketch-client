import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';

const toggleReady = (socket, id, readySoundRef) => {
  socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  readySoundRef.current.play();
};

const start = (ingameStompClient, id, token) => {
  ingameStompClient.publish({
    destination: '/app/game/start',
    body: JSON.stringify({ roomId: id, token }),
  });
  GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.startGame);
};

function sendDifficulty(difficulty, ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: '/app/game/difficulty',
    body: JSON.stringify({ roomId: id, token, difficulty }),
  });
}

function increaseTime(ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: '/app/game/increase-time',
    body: JSON.stringify({ roomId: id, token }),
  });
}

function decreaseTime(ingameStompClient, id, token) {
  ingameStompClient.publish({
    destination: '/app/game/decrease-time',
    body: JSON.stringify({ roomId: id, token }),
  });
}

export { toggleReady, start, sendDifficulty, increaseTime, decreaseTime };
