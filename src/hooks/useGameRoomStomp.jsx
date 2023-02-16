import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { closeStomp, setStomp } from '../app/slices/ingameSlice';
import { getCookie, setCookie } from '../utils/cookie';
import { SOCKET_PUB_DEST, SOCKET_SUB_DEST, TIME_LIMIT } from '../helper/constants';
import authAPI from '../api/auth';
import requestNewToken from '../utils/requestNewToken';

function useGameRoomStomp(subArray, id, socketID) {
  const dispatch = useDispatch();
  const member = useSelector((state) => state.login.member);
  const [difficulty, setDifficulty] = useState('');
  const [timeLimit, setTimeLimit] = useState(TIME_LIMIT.INIT_LIMIT);
  const [isIngame, setIsIngame] = useState(false);

  useEffect(() => {
    requestNewToken();

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
          client.subscribe(`${SOCKET_SUB_DEST.START_GAME}/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setIsIngame(data.isIngame);
            requestNewToken();
          }),
        );
        subArray.push(
          client.subscribe(`${SOCKET_SUB_DEST.DIFFICULTY}/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setDifficulty(data.difficulty);
          }),
        );
        subArray.push(
          client.subscribe(`${SOCKET_SUB_DEST.TIME_LIMIT}/${id}`, (message) => {
            const data = JSON.parse(message.body);
            setTimeLimit(data.timeLimit);
          }),
        );
        subArray.push(
          client.subscribe(`${SOCKET_SUB_DEST.SET_GAME}/${socketID}`, (message) => {
            const data = JSON.parse(message.body);
            setDifficulty(data.difficulty);
            setTimeLimit(data.timeLimit);
          }),
        );

        client.publish({
          destination: SOCKET_PUB_DEST.SET_GAME,
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
  return { difficulty, timeLimit, isIngame };
}

export default useGameRoomStomp;
