import React from 'react';
import styled from 'styled-components';
import Container from '../components/layout/Container';
import MyProfile from '../components/user/MyProfile';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import useModal from '../hooks/useModal';
import like from '../assets/icons/empty-like-icon.svg';
import badge from '../assets/icons/badge-icon.svg';

function MyPage() {
  const { openModal } = useModal();

  const openEditProfileModal = () => {
    openModal({ type: 'editProfile' });
  };

  return (
    <>
      <FloatBox top={<SettingButton size="xlarge" />} />
      <Container>
        <MyProfileArea>
          <MyProfile />
          <EditProfile onClick={openEditProfileModal}>프로필 편집</EditProfile>
        </MyProfileArea>
        <MyButtonArea>
          <MyButton>
            <img src={like} alt="like" />
            내가 좋아요한 이미지
          </MyButton>
          <MyButton>
            <img src={badge} alt="badge" />
            나의 뱃지
          </MyButton>
        </MyButtonArea>
        <MyBadgeArea />
      </Container>
    </>
  );
}

const EditProfile = styled.p`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: underline;
  cursor: pointer;
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

  & img {
    margin-right: 20px;
  }
`;

const MyButtonArea = styled.div`
  width: 60%;
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const MyBadgeArea = styled.div`
  width: 20%;
  ${({ theme }) => theme.common.flexCenterColumn};
`;

export default MyPage;
