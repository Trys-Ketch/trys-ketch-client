import React, { useState } from 'react';
import styled from 'styled-components';
// import CreateRoomModal from '../components/modal/CreateRoomModal';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import RoomList from '../components/game/RoomList';
import CreateRoomModal from '../components/modal/CreateRoomModal';

// mock data
const rooms = [
  { id: 1, title: '피카소만 들어와요', cur: 1, max: 8 },
  { id: 2, title: '피카소만 들어와요', cur: 2, max: 8 },
  { id: 3, title: '피카소만 들어와요', cur: 3, max: 8 },
  { id: 4, title: '피카소만 들어와요', cur: 4, max: 8 },
  { id: 5, title: '피카소만 들어와요', cur: 5, max: 8 },
  { id: 6, title: '피카소만 들어와요', cur: 6, max: 8 },
];

const userInfo = {
  nickname: '내이름은피카소',
};

function Lobby() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const LinkToMyPage = () => {
    navigate('/myPage');
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Layout>
        <Side>
          <Profile>
            <Avatar />
            <Nickname>{userInfo.nickname}</Nickname>
          </Profile>
          <Button onClick={LinkToMyPage}>마이페이지</Button>
        </Side>
        <Main>
          <RoomList rooms={rooms} />
          <BottomBtns>
            <Button>초대코드 입력</Button>
            <Button onClick={handleModal}>방만들기</Button>
          </BottomBtns>
        </Main>
      </Layout>
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
