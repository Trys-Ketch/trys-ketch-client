import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function Guest() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleInput = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = () => {
    // guest 입장 api
    navigate('/');
  };

  return (
    <Layout>
      <Avatar width="68px" height="68px" />
      <Input value={nickname} onChange={handleInput} />
      <Button onClick={handleSubmit}>완료</Button>
    </Layout>
  );
}

const Layout = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Guest;
