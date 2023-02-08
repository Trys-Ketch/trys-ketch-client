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
import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';
import useEventSource from '../hooks/useEventSource';

function Lobby() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { data: rooms } = useEventSource(`${process.env.REACT_APP_API_URL}/api/sse/rooms`);
  const [page, setPage] = useState(0);
  const [roomsByPage, setRoomsByPage] = useState([]);
  const [lastPage, setLastPage] = useState(1);

  const ROOM_PER_PAGE = 5;

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
  }, [page, rooms]);

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
