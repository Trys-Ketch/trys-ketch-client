import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import KakaoLoginBtn from '../components/login/KakaoLoginBtn';
import NaverLoginBtn from '../components/login/NaverLoginBtn';
import GoogleLoginBtn from '../components/login/GoogleLoginBtn';
import Layout from '../components/common/Layout';
import Panel from '../components/common/Panel';
import logo from '../assets/images/logo.png';

function Login() {
  const navigate = useNavigate();
  return (
    <Layout>
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
    </Layout>
  );
}

const Logo = styled.img`
  max-width: 600px;
  min-width: 450px;
  width: 50%;
  margin-bottom: 30px;
`;

const Typography = styled.span`
  color: '#4e473f';
  font-weight: 600;
`;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;

  & div:not(:first-child) {
    margin-left: 30px;
  }
`;

export default Login;
