import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../components/layout/Container';
import MyProfile from '../components/user/MyProfile';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import like from '../assets/icons/empty-like-icon.svg';
import badge from '../assets/icons/badge-icon.svg';
import logout from '../assets/icons/logout-icon.svg';
import arrow from '../assets/icons/right-arrow.svg';
import { delCookie } from '../utils/cookie';
import { toast } from '../components/toast/ToastProvider';

function MyPage() {
  const navigate = useNavigate();
  const { member } = useSelector((state) => state.login);

  const goToLobby = () => {
    navigate('/');
  };

  const openMyLikeImages = () => {
    if (member === 'guest') {
      toast.error('회원만 이용가능합니다😯');
    } else {
      toast.info('준비중입니다🔨');
    }
  };

  const openMyBadges = () => {
    if (member === 'guest') {
      toast.error('회원만 이용가능합니다😯');
    } else {
      toast.info('준비중입니다🔨');
    }
  };

  const handleLogout = () => {
    delCookie();
    delCookie('guest');
    toast.success('로그아웃되었습니다');
    navigate('/login');
  };

  return (
    <>
      <FloatBox top={<SettingButton size="xlarge" />} />
      <Container>
        <BackButton onClick={goToLobby}>
          <img src={arrow} alt="back" />
        </BackButton>
        <MyProfileArea>
          <MyProfile />
        </MyProfileArea>
        <MyButtonArea>
          <MyButton onClick={openMyLikeImages}>
            <img src={like} alt="like" />
            내가 좋아요한 이미지
          </MyButton>
          <MyButton onClick={openMyBadges}>
            <img src={badge} alt="badge" />
            나의 뱃지
          </MyButton>
          <MyButton onClick={handleLogout}>
            <img src={logout} alt="badge" />
            로그아웃
          </MyButton>
        </MyButtonArea>
        <MyBadgeArea />
      </Container>
    </>
  );
}

const BackButton = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 15px 10px;

  & img {
    width: 30px;
    height: 30px;
    transform: rotate(180deg);
  }
`;

const MyProfileArea = styled.div`
  width: 20%;
  margin-top: 30px;
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const MyButton = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;

  & img {
    margin-right: 20px;
  }
`;

const MyButtonArea = styled.div`
  width: 60%;
  ${({ theme }) => theme.common.flexCenterColumn};

  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

const MyBadgeArea = styled.div`
  width: 20%;
  ${({ theme }) => theme.common.flexCenterColumn};
`;

export default MyPage;
