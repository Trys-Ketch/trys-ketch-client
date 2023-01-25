import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import { setStomp, setIngameHost } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MikeButton from '../components/button/MikeButton';
import copy from '../assets/icons/copy-icon.svg';
import QuitButton from '../components/button/QuitButton';
import RoomTitle from '../components/room/RoomTitle';
import ChatBox from '../components/chat/ChatBox';
import Explain from '../components/room/Explain';
import roomAPI from '../api/room';
import { toast } from '../components/toast/ToastProvider';

let token;
const subArray = [];

function GameRoom() {
  const [roomTitle, setRoomTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hostID, setHostID] = useState('');
  const [allReady, setAllReady] = useState(false);
  const [isIngame, setIsIngame] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [cookies] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const socket = useSelector((state) => state.ingame.socket);

  const getRoomDetail = () => {
    roomAPI
      .getRoomDetail(id)
      .then((res) => {
        const { title, randomCode } = res.data.data;
        setRoomTitle(title);
        setInviteCode(randomCode);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const toggleReady = () => {
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  };

  const start = () => {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    ingameStompClient.publish({
      destination: '/app/game/start',
      body: JSON.stringify({ roomId: id, token }),
    });
  };

  const handleCodeCopy = () => {
    window.navigator.clipboard.writeText(inviteCode).then(() => {
      toast.success('복사되었습니다.');
    });
  };

  useEffect(() => {
    getRoomDetail();
  }, []);

  useEffect(() => {
    const gameRoomEventHandler = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'ingame/ready': {
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
          dispatch(setIngameHost(data.host));
          break;
        }
        case 'ingame/attendee': {
          console.log(data);
          setAttendees(data.attendee);
          break;
        }
        case 'ingame/be_kicked': {
          navigate('/');
          alert('강퇴됐어영 히잉 8ㅅ8');
          break;
        }
        default: {
          break;
        }
      }
    };
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
    console.log(socket);
    if (socket && socket.readyState === 1) {
      console.log(socket.readyState);
      socket.send(JSON.stringify({ type: 'ingame/end_game', room: id }));
    }
  }, [socket]);

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
      console.error('Stomp Error!: ', frame.headers.message);
      console.error('Additional details: ', frame.body);
    };
    client.onDisconnect = (frame) => {
      // console.log('Stomp Disconnected');
    };
    dispatch(setStomp(client));
    return () => {
      if (client) {
        for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton size="xlarge" />
            <MikeButton size="xlarge" />
          </>
        }
        bottom={<QuitButton size="xlarge" />}
      />
      <Container>
        <Main>
          <RoomTitle>{roomTitle}</RoomTitle>
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
            <img src={copy} width="18px" height="18px" alt="copy" style={{ marginLeft: '10px' }} />
          </Button>
          {isHost ? (
            <Button
              txtcolor={({ theme }) => theme.colors.WHITE}
              bgcolor={({ theme }) => theme.colors.YELLOW_GREEN}
              shadow={({ theme }) => theme.colors.PAKISTAN_GREEN}
              onClick={() => start()}
              width="100%"
              size="large"
              disabled={!allReady}
              style={{ marginLeft: 0 }}
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
              onClick={toggleReady}
              style={{ marginLeft: 0 }}
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
  font-size: ${({ theme }) => theme.fontSizes.xxl};
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
