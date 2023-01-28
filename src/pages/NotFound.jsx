import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import FlatButton from '../components/common/FlatButton';
import characters from '../assets/images/jumping-trysketch.svg';

function NotFound() {
  const navigate = useNavigate();

  const linkToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Layout>
      <Logo src={characters} alt="characters" />
      <Title>404 ERROR</Title>
      <SubTitle>페이지를 찾을 수 없습니다.</SubTitle>
      <Description>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</Description>
      <FlatButton onClick={linkToHome} width="300px" size="small">
        홈으로 돌아가기
      </FlatButton>
    </Layout>
  );
}

const Logo = styled.img`
  width: 300px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

const Title = styled.h2`
  font-family: 'TTTogether';
  font-size: 56px;
  margin-bottom: 10px;
`;

const SubTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: 40px;
`;

const Description = styled.p`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: 40px;
`;

export default NotFound;
