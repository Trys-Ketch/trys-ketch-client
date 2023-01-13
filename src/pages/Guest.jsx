import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authAPI from '../api/auth';
import userAPI from '../api/user';
import Avatar from '../components/common/Avatar';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Panel from '../components/layout/Panel';
import { setLogin } from '../app/slices/loginSlice';
import { setNickname } from '../app/slices/userSlice';
import { setCookie } from '../utils/cookie';
import refreshIcon from '../assets/icons/refresh-icon.svg';

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
    <Panel>
      <ProfileBox>
        <Avatar width="128px" height="128px" />
        {/* TODO - refresh function 추가 필요 */}
        <ProfileRefreshBtn>
          <img src={refreshIcon} alt="refresh" />
        </ProfileRefreshBtn>
      </ProfileBox>
      <InputBox>
        <Input
          maxLength="25"
          width="500px"
          value={name}
          onChange={handleInput}
          placeholder="닉네임을 입력해주세요"
        />
        <NameRefreshBtn onClick={getRandomNickname}>
          <img src={refreshIcon} alt="refresh" />
        </NameRefreshBtn>
      </InputBox>
      <Button width="350px" onClick={handleSubmit}>
        완료
      </Button>
    </Panel>
  );
}

const ProfileBox = styled.div`
  position: relative;
  margin-bottom: 38px;
`;

const InputBox = styled.div`
  position: relative;
  margin-bottom: 38px;
`;

const RefreshBtn = styled.button`
  transition: 0.15s linear;
  img {
    width: 38px;
  }
  &:active {
    transform: rotate(360deg);
  }
`;

const ProfileRefreshBtn = styled(RefreshBtn)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const NameRefreshBtn = styled(RefreshBtn)`
  position: absolute;
  right: 12px;
  top: 9px;
`;

export default Guest;
