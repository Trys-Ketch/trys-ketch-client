import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import Explain from '../components/room/Explain';

let token;
const subArray = [];

function GameRoom() {
  const { state } = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hostID, setHostID] = useState('');
  const [allReady, setAllReady] = useState(false);
  const [isIngame, setIsIngame] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const socket = useSelector((state) => state.ingame.socket);

  console.log(state);

  const toggleReady = () => {
    console.log(socket);
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  };

  const start = () => {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    ingameStompClient.publish({
      destination: '/app/game/start',
      body: JSON.stringify({ roomId: id * 1, token }),
    });
  };

  const handleCodeCopy = () => {
    window.navigator.clipboard.writeText(state.randomCode).then(() => {
      alert(`복사 완료!: ${state.randomCode}`);
    });
  };

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
        case 'ingame/attendee': {
          console.log(data);
          setAttendees(data.attendee);
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
          <RoomTitle>{state.title}</RoomTitle>
          <AttendeeList userList={attendees} />
          <ChatBox />
        </Main>
        <Side>
          <ExplainArea>
            <Explain />
          </ExplainArea>
          <SetTime>
            <Subtitle>제한 시간</Subtitle>
            <Time>1:00</Time>
          </SetTime>
          <Button onClick={handleCodeCopy} width="100%">
            초대코드 복사
            <img src={copy} alt="copy" />
          </Button>
          {isHost ? (
            <Button
              color={({ theme }) => theme.colors.WHITE}
              bgcolor={({ theme }) => theme.colors.YELLOW_GREEN}
              shadow={({ theme }) => theme.colors.PAKISTAN_GREEN}
              width="100%"
              size="large"
              disabled={!allReady}
            >
              게임 시작
            </Button>
          ) : (
            <Button
              color={({ theme }) => theme.colors.WHITE}
              bgcolor={({ theme }) => theme.colors.DEEP_BLUE}
              shadow={({ theme }) => theme.colors.SAPPHIRE}
              width="100%"
              size="large"
              onClick={toggleReady}
            >
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

const ExplainArea = styled(Box)`
  height: 45%;
`;

const SetTime = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25%;
`;

const Subtitle = styled.h3`
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const Time = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 42px;
`;

export default GameRoom;
