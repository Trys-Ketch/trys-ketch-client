import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import KakaoLoginBtn from '../components/login/KakaoLoginBtn';
import NaverLoginBtn from '../components/login/NaverLoginBtn';
import GoogleLoginBtn from '../components/login/GoogleLoginBtn';
import Panel from '../components/layout/Panel';
import logo from '../assets/images/ribbon-logo.svg';

function Login() {
  const navigate = useNavigate();
  return (
    <Panel>
      <Logo src={logo} alt="logo" />
      <Typography>간편로그인</Typography>
      <ButtonBox>
        <KakaoLoginBtn />
        <GoogleLoginBtn />
        <NaverLoginBtn />
      </ButtonBox>
      <Button
        onClick={() => {
          navigate('/guest');
        }}
        width="350px"
      >
        게스트 로그인
      </Button>
    </Panel>
  );
}

const Logo = styled.img`
  max-width: 600px;
  min-width: 450px;
  filter: drop-shadow(0 10px 12px #9f978b);
  margin-bottom: 30px;
`;

const Typography = styled.span`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ButtonBox = styled.div`
  width: 100%;
  ${({ theme }) => theme.common.flexCenter};
  margin-top: 20px;
  margin-bottom: 30px;

  & div:not(:first-child) {
    margin-left: 30px;
  }
`;

export default Login;
