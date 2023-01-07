import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageForm';
import AttendeeList from '../components/game/AttendeeList';
import Button from '../components/common/Button';

function GameRoom() {
  const navigate = useNavigate();

  const handleOut = () => {
    navigate('/');
  };

  return (
    <StRoom>
      <Header>
        <Button onClick={handleOut}>나가기</Button>
        <Button>세팅</Button>
      </Header>
      <Layout>
        <Main>
          <AttendeeList />
          <MessageList />
          <MessageInput />
        </Main>
        <Side>
          <Explain>게임설명</Explain>
          <SetTime>시간설정</SetTime>
          <Button>게임시작</Button>
        </Side>
      </Layout>
    </StRoom>
  );
}

const StRoom = styled.div`
  display: flex;
  flex-direction: column;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Main = styled.main`
  width: 70%;
`;

const Side = styled.aside`
  width: 30%;
`;

const Explain = styled.div`
  border: 1px solid;
  height: 60%;
`;

const SetTime = styled.div`
  border: 1px solid;
  height: 30%;
`;

export default GameRoom;
