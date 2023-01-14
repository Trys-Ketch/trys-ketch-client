import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import Stomp from '@stomp/stompjs';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageForm';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import roomAPI from '../api/room';

function GameRoom() {
  const [isReady, setIsReady] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hostID, setHostID] = useState('');
  const [allReady, setAllReady] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);

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

  // function toggleReady() {
  //   socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  // }

  // useEffect(() => {
  //   const gameRoomEventHandler = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log(data);
  //     switch (data.type) {
  //       case 'ingame/ready': {
  //         if (socketID === data.sender) setIsReady(data.status);
  //         break;
  //       }
  //       case 'ingame/all_ready': {
  //         setAllReady(data.status);
  //         break;
  //       }
  //       case 'ingame/is_host': {
  //         setIsHost(data.host);
  //         setHostID(data.hostId);
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   };
  //   if (socket) {
  //     console.log('event listener is added');
  //     socket.addEventListener('message', gameRoomEventHandler);
  //   }
  //   return () => {
  //     if (socket) {
  //       console.log('event listener is removed');
  //       socket.removeEventListener('message', gameRoomEventHandler);
  //     }
  //   };
  // }, [socket, socketID]);

  useEffect(() => {
    const client = new Stomp.Client({
      brokerURL: process.env.REACT_APP_API_URL,
      debug: (str) => {
        console.log(str);
      },
    });
    client.onConnect = (frame) => {
      console.log(frame);
    };
    client.onStompError = (frame) => {
      console.err('Stomp Error!: ', frame.headers.message);
      console.err('Additional details: ', frame.body);
    };
    client.onDisconnect = (frame) => {
      console.log('Stomp Disconnected');
    };
    client.activate();
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
          {isHost ? <Button disabled={!allReady}>게임 시작</Button> : null}
          {/* <Button onClick={() => toggleReady()}>{isReady ? '취소' : '준비'}</Button> */}
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
