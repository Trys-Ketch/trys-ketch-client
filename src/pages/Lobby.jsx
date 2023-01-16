import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import roomAPI from '../api/room';
import Container from '../components/layout/Container';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import FlatButton from '../components/common/FlatButton';
import RoomList from '../components/room/RoomList';
import Pagination from '../components/room/Pagination';
import EmptyRoomList from '../components/room/EmptyRoomList';
import SettingButton from '../components/button/SettingButton';
import FloatBox from '../components/layout/FloatBox';
import MikeButton from '../components/button/MikeButton';
import useModal from '../hooks/useModal';

const userInfo = {
  nickname: '내이름은피카소',
};

function Lobby() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [rooms, setRooms] = useState([]);
  // lastPage는 1부터 page는 0부터
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const getRooms = (currentPage) => {
    roomAPI
      .getRoomList(currentPage)
      .then((res) => {
        setLastPage(res.data.LastPage);
        setRooms(res.data.Rooms);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefresh = () => {
    getRooms(page);
  };

  const handleOpenCreateRoom = () => {
    openModal('createRoom');
  };

  const handleOpenInvite = () => {
    openModal('inviteCode');
  };

  const LinkToMyPage = () => {
    navigate('/myPage');
  };

  useEffect(() => {
    getRooms(page);
  }, [page]);

  return (
    <>
      <FloatBox>
        <SettingButton size="medium" />
        <MikeButton size="medium" />
      </FloatBox>
      <Container>
        <Side>
          <Profile>
            <Avatar width="80px" height="80px" />
            <Nickname>{userInfo.nickname}</Nickname>
          </Profile>
          <FlatButton size="small" onClick={LinkToMyPage}>
            마이페이지
          </FlatButton>
          <Button onClick={handleRefresh}>새로고침</Button>
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
                <RoomList rooms={rooms} />
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

const Side = styled.div`
  width: 20%;
  height: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Profile = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const Nickname = styled.h3`
  font-family: 'Pretendard';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  margin: 10px 0 20px 0;
`;

const Main = styled.div`
  width: 80%;
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
  background: #f5ebda;
  padding: 20px;
  border-radius: 10px;
`;

export default Lobby;
