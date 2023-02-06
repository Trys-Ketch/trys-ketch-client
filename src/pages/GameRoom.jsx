import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AttendeeList from '../components/room/AttendeeList';
import Button from '../components/common/Button';
import { setIngameHost } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MicButton from '../components/button/MicButton';
import copy from '../assets/icons/copy-icon.svg';
import inc from '../assets/icons/time-increase-icon.svg';
import dec from '../assets/icons/time-decrease-icon.svg';
import QuitButton from '../components/button/QuitButton';
import RoomTitle from '../components/room/RoomTitle';
import ChatBox from '../components/chat/ChatBox';
import roomAPI from '../api/room';
import { toast } from '../components/toast/ToastProvider';
import { getCookie } from '../utils/cookie';
import useDidMountEffect from '../hooks/useDidMountEffect';
import GAEventTypes from '../ga/GAEventTypes';
import GAEventTrack from '../ga/GAEventTrack';
import { setLocalMute, setMuteUsers } from '../app/slices/muteSlice';
import MuteUserList from '../components/mute/MuteUserList';
import useModal from '../hooks/useModal';
import Difficulty from '../components/room/Difficulty';
import useMuteUser from '../hooks/useMuteUser';
import useGameRoomStomp from '../hooks/useGameRoomStomp';

let token;
let subArray = [];

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
  const [difficulty, setDifficulty] = useState('');
  const [timeLimit, setTimeLimit] = useState(60000);

  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const member = useSelector((state) => state.login.member);
  const userId = useSelector((state) => state.user.userId);
  const socketID = useSelector((state) => state.ingame.id);
  const socket = useSelector((state) => state.ingame.socket);
  const muteUser = useSelector((state) => state.mute.users);
  const localIsMuted = useSelector((state) => state.mute.localMute);

  const { openModal } = useModal();
  useMuteUser(attendees, muteUser);
  useGameRoomStomp(subArray, id, socketID, setIsIngame, setDifficulty, setTimeLimit);

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
        navigate('/', { replace: true });
      });
  };

  const toggleReady = () => {
    socket.send(JSON.stringify({ type: 'ingame/toggle_ready', room: id }));
  };

  const start = () => {
    ingameStompClient.publish({
      destination: '/app/game/start',
      body: JSON.stringify({ roomId: id, token }),
    });
    GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.startGame);
  };

  const handleCodeCopy = () => {
    window.navigator.clipboard.writeText(inviteCode).then(() => {
      toast.success('복사되었습니다.');
    });
  };

  const redirect = () => {
    if (myState && !myState?.socketId) {
      navigate('/', { replace: true });
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
          navigate('/', { replace: true });
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
    if (isIngame) navigate(`/ingame/${id}`, { replace: true });
  }, [isIngame]);

  useEffect(() => {
    getMyState();
    getAllReady();
  }, [attendees]);

  useDidMountEffect(() => {
    redirect();
  }, [attendees]);

  useEffect(() => {
    subArray = [];
    token = getCookie(member === 'guest' ? 'guest' : 'access_token');
  }, []);

  function sendDifficulty(difficulty) {
    ingameStompClient.publish({
      destination: '/app/game/difficulty',
      body: JSON.stringify({ roomId: id, token, difficulty }),
    });
  }

  function increaseTime() {
    ingameStompClient.publish({
      destination: '/app/game/increase-time',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  function decreaseTime() {
    ingameStompClient.publish({
      destination: '/app/game/decrease-time',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  function milsecToMinute(milsec) {
    const sec = milsec / 1000;
    const returnMinute = `${Math.floor(sec / 60)}`;
    const returnSec = `${sec % 60}`.length === 1 ? `0${sec % 60}` : `${sec % 60}`;

    return `${returnMinute}:${returnSec}`;
  }

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton size="xlarge" />
            <MicButton
              mute={localIsMuted}
              onClick={() => dispatch(setLocalMute(!localIsMuted))}
              size="xlarge"
            />
            <MuteUserList socketID={socketID} />
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
          <Difficulty
            disabled={!myState?.isHost}
            difficulty={difficulty}
            sendDifficulty={(dif) => sendDifficulty(dif)}
          />
          <SetTime>
            <Subtitle>제한 시간</Subtitle>
            <Time>
              {milsecToMinute(timeLimit)}
              <IncDecButtonWrapper>
                <IncDecButton
                  disabled={!myState?.isHost}
                  onClick={() => increaseTime()}
                  style={{ marginBottom: '2px' }}
                >
                  <img src={inc} alt="increase" />
                </IncDecButton>
                <IncDecButton
                  disabled={!myState?.isHost}
                  onClick={() => decreaseTime()}
                  style={{ marginTop: '2px' }}
                >
                  <img src={dec} alt="decrease" />
                </IncDecButton>
              </IncDecButtonWrapper>
            </Time>
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

const IncDecButton = styled.button`
  border: none;
  width: max-content;
  height: max-content;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const IncDecButtonWrapper = styled.div`
  margin-left: 10px;
  width: max-content;
  height: max-content;
  display: flex;
  flex-direction: column;
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
