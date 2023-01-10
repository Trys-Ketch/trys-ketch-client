import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authAPI from '../api/auth';
import userAPI from '../api/user';

function Guest() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleInput = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async () => {
    if (nickname === '') {
      alert('닉네임을 입력해주세요');
    }

    const trimedName = nickname.trim();
    await authAPI.guestLogin(trimedName).then((res) => {
      // TODO - 게스트 로그인 response.data.header.guest 쿠키 처리 필요
      if (res.data.statusCode === 200) {
        navigate('/');
        alert('게스트로그인 성공');
      }
    });
  };

  const getRandomNickname = async () => {
    await userAPI.getRandomNickname().then((res) => {
      setNickname(res.data.message);
    });
  };

  useEffect(() => {
    getRandomNickname();
  }, []);

  return (
    <Layout>
      <Avatar width="68px" height="68px" />
      <Input value={nickname} onChange={handleInput} />
      <Button onClick={getRandomNickname}>새로고침</Button>
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
