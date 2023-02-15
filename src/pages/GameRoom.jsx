import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/layout/Container';
import FloatBox from '../components/layout/FloatBox';
import Button from '../components/common/Button';
import { setIngameHost } from '../app/slices/ingameSlice';
import SettingButton from '../components/button/SettingButton';
import MicButton from '../components/button/MicButton';
import QuitButton from '../components/button/QuitButton';
import MuteUserList from '../components/mute/MuteUserList';
import AttendeeList from '../components/room/AttendeeList';
import Difficulty from '../components/room/Difficulty';
import RoomTitle from '../components/room/RoomTitle';
import ChatBox from '../components/chat/ChatBox';
import { toast } from '../components/toast/ToastProvider';
import { getCookie } from '../utils/cookie';
import roomAPI from '../api/room';
import { setLocalMute } from '../app/slices/muteSlice';
import useMuteUser from '../hooks/useMuteUser';
import useDidMountEffect from '../hooks/useDidMountEffect';
import useGameRoomStomp from '../hooks/useGameRoomStomp';
import { sendDifficulty } from '../utils/gameRoomStompUtils';
import ReadyStartButton from '../components/room/ReadyStartButton';
import SetTime from '../components/room/SetTime';
import copy from '../assets/icons/copy-icon.svg';
import { SOCKET_MSG } from '../helper/constants';

let token;
let subArray = [];

function GameRoom() {
  const [roomTitle, setRoomTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [myState, setMyState] = useState({});
  const [allReady, setAllReady] = useState(false);
  // [ { userId: 2, nickname: "닉네임", imgUrl: "avatar.png", isHost: true, isReady: true, socketId: "akef4dof"}, ... ]
  const [attendees, setAttendees] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const member = useSelector((state) => state.login.member);
  const userId = useSelector((state) => state.user.userId);
  const { socket, stomp: ingameStompClient } = useSelector((state) => state.ingame);

  // ingameslice의 id 프로퍼티로 socketID를 초기화해서 사용해야 되는데
  // useParams로 이미 id가 초기화되어서 위의 구조분해할당으로 초기화가 불가능하네요..
  // 이렇게 사용해야 할 것 같습니다!
  const socketID = useSelector((state) => state.ingame.id);
  console.log(socketID);

  const localIsMuted = useSelector((state) => state.mute.localMute);

  useMuteUser(attendees);
  const { difficulty, timeLimit, isIngame } = useGameRoomStomp(subArray, id, socketID);

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
          toast.error('에러가 발생했습니다');
        }
        navigate('/', { replace: true });
      });
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
        case SOCKET_MSG.ATTENDEE: {
          setAttendees(data.attendee);
          break;
        }
        case SOCKET_MSG.BE_KICKED: {
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
      socket.send(JSON.stringify({ type: SOCKET_MSG.END_GAME, room: id }));
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
            sendDifficulty={(dif) => sendDifficulty(dif, ingameStompClient, id, token)}
          />
          <SetTime
            timeLimit={timeLimit}
            myState={myState}
            ingameStompClient={ingameStompClient}
            id={id}
            token={token}
          />
          <Button onClick={handleCodeCopy} width="100%">
            초대코드 복사
            <img src={copy} width="18px" height="18px" alt="copy" style={{ marginLeft: '10px' }} />
          </Button>
          <ReadyStartButton
            myState={myState}
            ingameStompClient={ingameStompClient}
            id={id}
            token={token}
            allReady={allReady}
          />
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

export default GameRoom;
