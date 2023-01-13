import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import RoomList from '../components/game/RoomList';
import CreateRoomModal from '../components/modal/CreateRoomModal';
import roomAPI from '../api/room';
import Pagination from '../components/Pagination';

const userInfo = {
  nickname: '내이름은피카소',
};

// TODO - pagination 처리 필요
function Lobby() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefresh = () => {
    getRooms(page);
  };

  const LinkToMyPage = () => {
    navigate('/myPage');
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getRooms(page);
  }, [page]);

  return (
    <>
      <Side>
        <Profile>
          <Avatar />
          <Nickname>{userInfo.nickname}</Nickname>
        </Profile>
        <Button onClick={LinkToMyPage}>마이페이지</Button>
        <Button onClick={handleRefresh}>새로고침</Button>
      </Side>
      <Main>
        {rooms ? (
          <>
            <RoomList rooms={rooms} />
            <Pagination lastPage={lastPage} page={page} setPage={setPage} />
          </>
        ) : (
          // TODO - 비어있는 화면 구현 필요
          <div>empty</div>
        )}
        <BottomBtns>
          <Button>초대코드 입력</Button>
          <Button onClick={handleModal}>방만들기</Button>
        </BottomBtns>
      </Main>
      {isOpen && <CreateRoomModal setIsOpen={setIsOpen} />}
    </>
  );
}

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Nickname = styled.h3`
  font-size: 20px;
  font-weight: 500;
  margin: 10px 0;
`;

const Main = styled.div`
  width: 70%;
`;

const BottomBtns = styled.div``;

export default Lobby;
