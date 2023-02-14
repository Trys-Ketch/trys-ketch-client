import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../common/Button';
import { toggleReady, start } from '../../utils/gameRoomStompUtils';
import useSound from '../../hooks/useSound';
import readySound from '../../assets/sounds/ready_sound.wav';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function ReadyStartButton({ myState, ingameStompClient, id, token, allReady }) {
  const readySoundRef = useSound(readySound);
  const socket = useSelector((state) => state.ingame.socket);

  const handleStart = () => {
    start(ingameStompClient, id, token);
    GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.startGame);
  };

  const handleReady = () => {
    toggleReady(socket, id);
    readySoundRef.current.play();
  };

  return (
    <div style={{ width: '100%' }}>
      {myState?.isHost ? (
        <Button
          txtcolor={({ theme }) => theme.colors.WHITE}
          bgcolor={({ theme }) => theme.colors.YELLOW_GREEN}
          shadow={({ theme }) => theme.colors.PAKISTAN_GREEN}
          onClick={() => handleStart()}
          width="100%"
          size="large"
          disabled={!allReady}
        >
          게임 시작
        </Button>
      ) : (
        <Button
          txtcolor={({ theme }) => theme.colors.WHITE}
          bgcolor={({ theme }) => theme.colors.DEEP_BLUE}
          shadow={({ theme }) => theme.colors.SAPPHIRE}
          width="100%"
          size="large"
          onClick={() => handleReady()}
        >
          {myState?.isReady ? '취소' : '준비 완료'}
        </Button>
      )}
    </div>
  );
}

export default ReadyStartButton;
