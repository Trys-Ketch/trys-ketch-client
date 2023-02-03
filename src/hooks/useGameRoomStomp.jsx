import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { closeStomp, setStomp } from '../app/slices/ingameSlice';
import { getCookie } from '../utils/cookie';

function useGameRoomStomp(subArray, id, socketID, setIsIngame, setDifficulty, setTimeLimit) {
  const dispatch = useDispatch();
  const member = useSelector((state) => state.login.member);

  useEffect(() => {
    const token = getCookie(member === 'guest' ? 'guest' : 'access_token');
    const client = new Stomp.Client({
      debug: (str) => {},
      splitLargeFrames: true,
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
    });

    client.onStompError = (frame) => {
      console.error('Stomp Error!: ', frame.headers.message);
      console.error('Additional details: ', frame.body);
    };

    client.onDisconnect = (frame) => {
      dispatch(closeStomp());
    };
    dispatch(setStomp(client));

    const p = new Promise((resolve, reject) => {
      client.onConnect = (frame) => {
        subArray.push(
          client.subscribe(`/topic/game/start/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setIsIngame(data.isIngame);
          }),
        );
        subArray.push(
          client.subscribe(`/topic/game/difficulty/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setDifficulty(data.difficulty);
          }),
        );
        subArray.push(
          client.subscribe(`/topic/game/time-limit/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setTimeLimit(data.timeLimit);
          }),
        );
        subArray.push(
          client.subscribe(`/queue/game/gameroom-data/${socketID}`, (message) => {
            const data = JSON.parse(message.body);
            setDifficulty(data.difficulty);
            setTimeLimit(data.timeLimit);
          }),
        );

        client.publish({
          destination: '/app/game/gameroom-data',
          body: JSON.stringify({ roomId: id, token, webSessionId: socketID }),
        });

        resolve();
      };
    }).then(() => {
      dispatch(setStomp(client));
    });

    return () => {
      for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
    };
  }, []);
}

export default useGameRoomStomp;
