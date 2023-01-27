import React, { useEffect, useRef, useState } from 'react';
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
import LobbyProfile from '../components/user/LobbyProfile';
import roomAPI from '../api/room';
import { toast } from '../components/toast/ToastProvider';

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

  // TODO - SSE 임시 제거 API로 대체
  // const openEvtSource = () => {
  //   // 연결됐을때 방 정보 받아오기
  //   evtSource.addEventListener('connect', (event) => {
  //     const data = JSON.parse(event.data);
  //     setRooms(data);
  //   });
  //   // 방 정보가 변할 때 방 정보 받아오기
  //   evtSource.addEventListener('changeRoom', (event) => {
  //     const data = JSON.parse(event.data);
  //     setRooms(data);
  //   });
  // };

  // const closeEvtSource = () => {
  //   evtSource.close();
  // };

  // useEffect(() => {
  //   openEvtSource();
  //   return () => {
  //     closeEvtSource();
  //   };
  // }, []);

  const handleOpenCreateRoom = () => {
    openModal('createRoom');
  };

  const handleOpenInvite = () => {
    openModal('inviteCode');
  };

  const LinkToMyPage = () => {
    toast.info('준비 중이에요🔨');
    // navigate('/myPage');
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
          <LobbyProfile />
          <FlatButton size="small" onClick={LinkToMyPage}>
            마이페이지
          </FlatButton>
          <Button size="small" onClick={() => getRooms(page)} style={{ marginTop: '10px' }}>
            새로고침
          </Button>
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
        </Main>
      </Container>
    </>
  );
}

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
