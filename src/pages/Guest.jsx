import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authAPI from '../api/auth';
import userAPI from '../api/user';
import Avatar from '../components/common/Avatar';
import TextInput from '../components/common/TextInput';
import Button from '../components/common/Button';
import Panel from '../components/layout/Panel';
import { setLogin } from '../app/slices/loginSlice';
import { setCookie } from '../utils/cookie';
import RefreshButton from '../components/button/RefreshButton';
import { toast } from '../components/toast/ToastProvider';
import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';

function Guest() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    if (name === '') {
      toast.error('닉네임을 입력해주세요');
      return;
    }

    const trimedName = name.trim();
    await authAPI
      .guestLogin(trimedName, image)
      .then((res) => {
        if (res.data.statusCode === 200) {
          dispatch(setLogin('guest'));
          setCookie(res.headers.guest, 'guest');
          navigate('/');
          toast.success('로그인되었습니다.');
          GAEventTrack(
            GAEventTypes.Category.auth,
            GAEventTypes.Action.auth.login,
            GAEventTypes.Label.guest,
          );
        }
      })
      .catch(() => toast.error('에러가 발생했습니다.'));
  };

  const getRandomNickname = () => {
    GAEventTrack(
      GAEventTypes.Category.userProfile,
      GAEventTypes.Action.userProfile.refreshNickname,
      GAEventTypes.Label.guest,
    );
    userAPI.getRandomNickname().then((res) => {
      setName(res.data.message);
    });
  };

  const getRandomImage = () => {
    GAEventTrack(
      GAEventTypes.Category.userProfile,
      GAEventTypes.Action.userProfile.refreshNickname,
      GAEventTypes.Label.guest,
    );
    userAPI.getRandomImage().then((res) => {
      setImage(res.data.message);
    });
  };

  useEffect(() => {
    getRandomNickname();
  }, []);

  useEffect(() => {
    getRandomImage();
  }, []);

  return (
    <Panel>
      <ProfileBox>
        <Avatar src={image} width="128px" height="128px" />
        <ProfileRefreshBtn onClick={getRandomImage} />
      </ProfileBox>
      <InputBox>
        <TextInput
          maxLength="12"
          width="500px"
          value={name}
          onChange={handleInput}
          placeholder="닉네임을 입력해주세요"
        />
        <NameRefreshBtn onClick={getRandomNickname} />
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

const ProfileRefreshBtn = styled(RefreshButton)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const NameRefreshBtn = styled(RefreshButton)`
  position: absolute;
  right: 12px;
  top: 9px;
`;

export default Guest;
