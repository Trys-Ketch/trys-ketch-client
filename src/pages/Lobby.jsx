import React, { useEffect, useState } from 'react';
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
import useEventSource from '../hooks/useEventSource';

function Lobby() {
  // const evtSource = new EventSource(`${process.env.REACT_APP_API_URL}/api/sse/rooms`);
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [roomsByPage, setRoomsByPage] = useState([]);
  const [lastPage, setLastPage] = useState(1);

  const ROOM_PER_PAGE = 5;

  useEventSource(`${process.env.REACT_APP_API_URL}/api/sse/rooms`, setRooms);

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

  //   const connectEvent = (event) => {
  //     console.log('open');
  //     const data = JSON.parse(event.data);
  //     console.log(data);
  //     setRooms(data);
  //   };

  //   const changeEvent = (event) => {
  //     console.log('change');
  //     const data = JSON.parse(event.data);
  //     console.log(data);
  //     setRooms(data);
  //   };

  //   evtSource.onopen = () => {
  //     // 연결됐을때 방 정보 받아오기
  //     evtSource.addEventListener('connect', connectEvent);
  //     // 방 정보가 변할 때 방 정보 받아오기
  //     evtSource.addEventListener('changeRoom', changeEvent);
  //   };
  //   evtSource.onmessage = (event) => {
  //     console.log(event);
  //   };
  //   evtSource.onerror = (e) => {
  //     console.log('error:', e);
  //     console.log('error:', evtSource);
  //     evtSource.removeEventListener('connect', connectEvent);
  //     evtSource.removeEventListener('changeRoom', changeEvent);
  //   };

  //   return () => {
  //     evtSource.removeEventListener('connect', connectEvent);
  //     evtSource.removeEventListener('changeRoom', changeEvent);
  //     console.log('Event Source is closed');
  //     evtSource.close();
  //     console.log(evtSource);
  //   };
  // }, []);

  const handleOpenCreateRoom = () => {
    openModal({ type: 'createRoom' });
  };

  const handleOpenInvite = () => {
    openModal({ type: 'inviteCode' });
  };

  const linkToMyPage = () => {
    navigate('/myPage');
    GAEventTrack(GAEventTypes.Category.mypage, GAEventTypes.Action.mypage.goToMypage);
  };

  const linkToPractice = () => {
    navigate('/practice');
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
          <SideTop>
            <MyProfile />
            <FlatButton size="small" onClick={linkToMyPage}>
              마이페이지
            </FlatButton>
          </SideTop>
          <SideBottom>
            <Button onClick={() => openModal({ type: 'howToPlay' })}>게임 방법</Button>
            <Button onClick={linkToPractice}>연습장</Button>
          </SideBottom>
        </Side>
        <Main>
          <TopBtns>
            <Button onClick={handleOpenCreateRoom}>방 만들기</Button>
            <Button onClick={handleOpenInvite}>초대 코드</Button>
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

const SideTop = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const SideBottom = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};

  Button {
    width: 100%;
  }

  & :not(:first-child) {
    margin-top: 10px;
  }
`;

const Side = styled.div`
  width: 20%;
  height: 100%;
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

  Button:not(:first-child) {
    margin-left: 0.75rem;
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
