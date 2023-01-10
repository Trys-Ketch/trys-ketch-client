import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Avatar from '../components/common/Avatar';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authAPI from '../api/auth';
import userAPI from '../api/user';
import { setLogin } from '../app/slices/loginSlice';
import { setNickname } from '../app/slices/userSlice';
import { setCookie } from '../utils/cookie';

function Guest() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (name === '') {
      alert('닉네임을 입력해주세요');
    }

    const trimedName = name.trim();
    await authAPI.guestLogin(trimedName).then((res) => {
      if (res.data.statusCode === 200) {
        dispatch(setLogin('guest'));
        dispatch(setNickname(trimedName));
        setCookie(res.headers.guest, 'guest');
        navigate('/');
        alert('게스트로그인 성공');
      }
    });
  };

  const getRandomNickname = () => {
    userAPI.getRandomNickname().then((res) => {
      setName(res.data.message);
    });
  };

  useEffect(() => {
    getRandomNickname();
  }, []);

  return (
    <Layout>
      <Avatar width="68px" height="68px" />
      <Input value={name} onChange={handleInput} />
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
