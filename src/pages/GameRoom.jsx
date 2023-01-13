import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageForm';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import roomAPI from '../api/room';
import { RTCOnmessageFunction } from '../components/webRTC/AudioCall.tsx';

function GameRoom() {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const socket = useSelector((state) => state.socket.socket);
  const socketID = useSelector((state) => state.socket.id);

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
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  }

  useEffect(() => {
    const gameRoomEventHandler = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      switch (data.type) {
        case 'ingame/ready': {
          if (socketID === data.sender) setIsReady(data.status);
          break;
        }
        case 'ingame/all_ready': {
          console.log(data);
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
          <Button>게임시작</Button>
          <Button onClick={() => toggleReady()}>{isReady ? '취소' : '준비'}</Button>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
