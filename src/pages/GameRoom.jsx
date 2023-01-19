import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import { setStomp } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MikeButton from '../components/button/MikeButton';
import copy from '../assets/icons/copy-icon.svg';
import QuitButton from '../components/button/QuitButton';
import RoomTitle from '../components/room/RoomTitle';
import ChatBox from '../components/chat/ChatBox';

let token;
const subArray = [];

function GameRoom() {
  const [isReady, setIsReady] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hostID, setHostID] = useState('');
  const [allReady, setAllReady] = useState(false);
  const [isIngame, setIsIngame] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const socket = useSelector((state) => state.ingame.socket);

  function toggleReady() {
    console.log(socket);
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  }

  function start() {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    ingameStompClient.publish({
      destination: '/app/game/start',
      body: JSON.stringify({ roomId: id * 1, token }),
    });
  }

  useEffect(() => {
    const gameRoomEventHandler = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'ingame/ready': {
          console.log(data.status);
          if (socketID === data.sender) setIsReady(data.status);
          break;
        }
        case 'ingame/all_ready': {
          setAllReady(data.status);
          break;
        }
        case 'ingame/is_host': {
          setIsHost(data.host);
          setHostID(data.hostId);
          break;
        }
        default: {
          break;
        }
      }
    };
    console.log(gameRoomEventHandler);
    if (socket) {
      console.log('event listener is added');
      socket.addEventListener('message', gameRoomEventHandler);
    }
    return () => {
      if (socket) {
        console.log('event listener is removed');
        socket.removeEventListener('message', gameRoomEventHandler);
      }
    };
  }, [socket, socketID]);

  useEffect(() => {
    console.log(ingameStompClient);
    if (ingameStompClient) ingameStompClient.activate();
  }, [ingameStompClient]);

  useEffect(() => {
    if (isIngame) navigate(`/ingame/${id}`);
  }, [isIngame]);

  useEffect(() => {
    const client = new Stomp.Client({
      debug: (str) => {
        console.log(str);
      },
      splitLargeFrames: true,
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
    });
    client.onConnect = (frame) => {
      subArray.push(
        client.subscribe(`/topic/game/start/${id}`, (message) => {
          const data = JSON.parse(message.body);
          setIsIngame(data.isIngame);
        }),
      );
    };
    client.onStompError = (frame) => {
      console.err('Stomp Error!: ', frame.headers.message);
      console.err('Additional details: ', frame.body);
    };
    client.onDisconnect = (frame) => {
      console.log('Stomp Disconnected');
    };
    dispatch(setStomp(client));
    return () => {
      if (client) {
        console.log('client unsubscribes');
        for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton />
            <MikeButton />
          </>
        }
        bottom={<QuitButton />}
      />
      <Container>
        <Main>
          <RoomTitle>가나다라마바사아자차카타파하</RoomTitle>
          <AttendeeList />
          <ChatBox />
        </Main>
        <Side>
          <Explain>
            <Subtitle>게임 방법</Subtitle>
          </Explain>
          <SetTime>
            <Subtitle>제한 시간</Subtitle>
          </SetTime>
          <Button width="100%">
            초대코드 복사
            <img src={copy} alt="copy" />
          </Button>
          {isHost ? (
            <Button onClick={() => start()} disabled={!allReady}>
              게임 시작
            </Button>
          ) : (
            <Button width="100%" size="large" onClick={() => toggleReady()}>
              {isReady ? '취소' : '준비 완료'}
            </Button>
          )}
        </Side>
      </Container>
    </>
  );
}

const Main = styled.main`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 75%;
  height: 100%;
  margin-right: 15px;

  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

const Side = styled.aside`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 25%;
  height: 100%;

  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

const Box = styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 10px;
`;

const Explain = styled(Box)`
  height: 60%;
`;

const SetTime = styled(Box)`
  height: 30%;
`;

const Subtitle = styled.h3`
  width: 100%;
  text-align: center;
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

export default GameRoom;
