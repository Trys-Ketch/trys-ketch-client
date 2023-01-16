import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageForm';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import roomAPI from '../api/room';
import { setStomp } from '../app/slices/ingameSlice';

let token;

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
  const socket = useSelector((state) => state.socket.socket);

  const handleOut = () => {
    roomAPI
      .exitRoom(id)
      .then((res) => {
        if (res.data.statusCode === 200) {
          alert(res.data.message);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function toggleReady() {
    console.log(socket);
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  }

  function start() {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    console.log(id);
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
    if (ingameStompClient) ingameStompClient.activate();
  }, [ingameStompClient]);

  useEffect(() => {
    if (isIngame) navigate(`/ingame/${id}`);
  }, [isIngame]);

  useEffect(() => {
    const client = new Stomp.Client({
      // brokerURL: process.env.REACT_APP_STOMP_URL,
      debug: (str) => {
        console.log(str);
      },
      // webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/signal`),
      webSocketFactory: () => new WebSocket(`${process.env.REACT_APP_STOMP_URL}`),
    });
    client.onConnect = (frame) => {
      client.subscribe(`/topic/game/room/${id}`, (message) => {
        const data = JSON.parse(message.body);

        setIsIngame(data.isIngame);
      });
      client.subscribe('ingame/start');
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
      if (ingameStompClient) {
        console.log('ingameStompClient unsubscribes');
        ingameStompClient.unsubscribe();
      }
    };
  }, []);

  return (
    <StRoom>
      <Header>
        <Button onClick={handleOut}>나가기</Button>
        <Button>세팅</Button>
      </Header>
      <Layout>
        <Main>
          <AttendeeList />
          <MessageList />
          <MessageInput />
        </Main>
        <Side>
          <Explain>게임설명</Explain>
          <SetTime>시간설정</SetTime>
          {isHost ? (
            <Button onClick={() => start()} disabled={!allReady}>
              게임 시작
            </Button>
          ) : null}
          {isHost ? null : (
            <Button onClick={() => toggleReady()}>{isReady ? '취소' : '준비'}</Button>
          )}
        </Side>
      </Layout>
    </StRoom>
  );
}

const StRoom = styled.div`
  display: flex;
  flex-direction: column;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`;

const Header = styled.div`
  ${({ theme }) => theme.common.flexBetween};
`;

const Main = styled.main`
  width: 70%;
`;

const Side = styled.aside`
  width: 30%;
`;

const Explain = styled.div`
  border: 1px solid;
  height: 60%;
`;

const SetTime = styled.div`
  border: 1px solid;
  height: 30%;
`;

export default GameRoom;
