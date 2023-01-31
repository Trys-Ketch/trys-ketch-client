import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import FlatButton from '../components/common/FlatButton';
import RoomList from '../components/room/RoomList';
import Pagination from '../components/room/Pagination';
import EmptyRoomList from '../components/room/EmptyRoomList';
import SettingButton from '../components/button/SettingButton';
import FloatBox from '../components/layout/FloatBox';
import useModal from '../hooks/useModal';
import MyProfile from '../components/user/MyProfile';
import roomAPI from '../api/room';
import { toast } from '../components/toast/ToastProvider';
import RefreshButton from '../components/button/RefreshButton';
import refresh from '../assets/icons/refresh-icon.svg';
import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';

function Lobby() {
  // const evtSource = new EventSource(`${process.env.REACT_APP_API_URL}/api/sse/rooms`);
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [roomsByPage, setRoomsByPage] = useState([]);
  const [lastPage, setLastPage] = useState(1);

  const ROOM_PER_PAGE = 5;

  const getRooms = (currentPage) => {
    roomAPI
      .getRoomList(currentPage)
      .then((res) => {
        setLastPage(res.data.LastPage);
        setRooms(res.data.Rooms);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    getRooms(page);
  }, [page]);

  // useEffect(() => {
  //   const evtSource = new EventSource(`${process.env.REACT_APP_API_URL}/api/sse/rooms`);

  //   evtSource.onopen = () => {
  //     console.log('open');
  //     // 연결됐을때 방 정보 받아오기
  //     evtSource.addEventListener('connect', (event) => {
  //       const data = JSON.parse(event.data);
  //       console.log(data);
  //       setRooms(data);
  //     });
  //     // 방 정보가 변할 때 방 정보 받아오기
  //     evtSource.addEventListener('changeRoom', (event) => {
  //       const data = JSON.parse(event.data);
  //       console.log(data);
  //       setRooms(data);
  //     });
  //   };
  //   evtSource.onmessage = (event) => {
  //     console.log(onmessage);
  //   };

  //   // evtSource.onmessage = (event) => {
  //   //   const data = JSON.parse(event.data);
  //   //   console.log(data);

  //   //   switch (data.type) {
  //   //     case 'ingame/attendee': {
  //   //       setAttendees(data.attendee);
  //   //       break;
  //   //     }
  //   //     case 'ingame/be_kicked': {
  //   //       navigate('/', { replace: true });
  //   //       toast.info('강퇴되었습니다');
  //   //       break;
  //   //     }
  //   //     default: {
  //   //       break;
  //   //     }
  //   //   }
  //   // };

  //   return () => {
  //     evtSource.close();
  //   };
  // }, []);

  const handleOpenCreateRoom = () => {
    openModal({ type: 'createRoom' });
  };

  const handleOpenInvite = () => {
    openModal({ type: 'inviteCode' });
  };

  const linkToMyPage = () => {
    // navigate('/myPage');
    toast.info('준비중이에요🔨');
    GAEventTrack(GAEventTypes.Category.mypage, GAEventTypes.Action.mypage.goToMypage);
  };

  useEffect(() => {
    setLastPage(Math.ceil(rooms.length / ROOM_PER_PAGE));
  }, [rooms]);

  useEffect(() => {
    const _roomsByPage = rooms.slice(page * ROOM_PER_PAGE, (page + 1) * ROOM_PER_PAGE);
    setRoomsByPage(_roomsByPage);
  }, [page, rooms]);

  return (
    <>
      <FloatBox top={<SettingButton size="xlarge" />} />
      <Container>
        <Side>
          <MyProfile />
          <FlatButton size="small" onClick={linkToMyPage}>
            마이페이지
          </FlatButton>
        </Side>
        <Main>
          <TopBtns>
            <Button onClick={handleOpenCreateRoom}>방 만들기</Button>
            <Button inline onClick={handleOpenInvite}>
              초대 코드
            </Button>
          </TopBtns>
          <RoomContainer>
            {rooms.length !== 0 ? (
              <>
                <RoomList rooms={roomsByPage} />
                <Pagination lastPage={lastPage} page={page} setPage={setPage} />
              </>
            ) : (
              <EmptyRoomList />
            )}
          </RoomContainer>
          <RoomRefreshButton onClick={() => getRooms(page)}>
            <img src={refresh} alt="refresh" />
          </RoomRefreshButton>
        </Main>
      </Container>
    </>
  );
}

const RoomRefreshButton = styled(RefreshButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100%;
`;

const Side = styled.div`
  width: 20%;
  height: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TopBtns = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;

  Button {
    width: 50%;
    flex-grow: 1;
  }
`;

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #f5ebda;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
`;

export default Lobby;
