import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import { setStomp, setIngameHost } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MicButton from '../components/button/MicButton';
import copy from '../assets/icons/copy-icon.svg';
import QuitButton from '../components/button/QuitButton';
import RoomTitle from '../components/room/RoomTitle';
import ChatBox from '../components/chat/ChatBox';
import Explain from '../components/room/Explain';
import roomAPI from '../api/room';
import { toast } from '../components/toast/ToastProvider';
import { getCookie } from '../utils/cookie';
import useDidMountEffect from '../hooks/useDidMountEffect';

let token;
const subArray = [];

function GameRoom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [roomTitle, setRoomTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [myState, setMyState] = useState({});
  const [allReady, setAllReady] = useState(false);
  const [isIngame, setIsIngame] = useState(false);
  // [ { userId: 2, nickname: "닉네임", imgUrl: "avatar.png", isHost: true, isReady: true, socketId: "akef4dof"}, ... ]
  const [attendees, setAttendees] = useState([]);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const member = useSelector((state) => state.login.member);
  const userId = useSelector((state) => state.user.userId);
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
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('에러가 났습니다');
        }
        navigate('/');
      });
  };

  const toggleReady = () => {
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  };

  const start = () => {
    token = getCookie(member === 'guest' ? 'guest' : 'access_token');

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

  const redirect = () => {
    if (myState && !myState?.socketId) {
      navigate('/');
    }
  };

  // attendees에서 내 상태
  const getMyState = () => {
    setMyState(attendees.find((attendee) => attendee.userId === userId));
    dispatch(setIngameHost(myState?.isHost));
  };

  // attendees에서 다 준비완료인지
  const getAllReady = () => {
    setAllReady(() => {
      // 최소 두명
      if (attendees.length < 2) {
        return false;
      }
      return attendees.every((attendee) => attendee.isReady);
    });
  };

  useEffect(() => {
    getRoomDetail();
  }, []);

  useEffect(() => {
    const gameRoomEventHandler = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'ingame/attendee': {
          setAttendees(data.attendee);
          break;
        }
        case 'ingame/be_kicked': {
          navigate('/');
          toast.info('강퇴되었습니다');
          break;
        }
        default: {
          break;
        }
      }
    };
    if (socket) {
      socket.addEventListener('message', gameRoomEventHandler);
    }
    return () => {
      if (socket) {
        socket.removeEventListener('message', gameRoomEventHandler);
      }
    };
  }, [socket, socketID]);

  useEffect(() => {
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify({ type: 'ingame/end_game', room: id }));
    }
  }, [socket]);

  useEffect(() => {
    if (ingameStompClient) ingameStompClient.activate();
  }, [ingameStompClient]);

  useEffect(() => {
    if (isIngame) navigate(`/ingame/${id}`);
  }, [isIngame]);

  useEffect(() => {
    getMyState();
    getAllReady();
  }, [attendees]);

  useDidMountEffect(() => {
    redirect();
  }, [attendees]);

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
            <MicButton size="xlarge" />
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
          {myState?.isHost ? (
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
              {myState?.isReady ? '취소' : '준비 완료'}
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
