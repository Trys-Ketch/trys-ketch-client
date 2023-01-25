import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setCookie } from '../utils/cookie';
import { setLogin } from '../app/slices/loginSlice';
import authAPI from '../api/auth';
import Button from '../components/common/Button';
import KakaoLoginBtn from '../components/login/KakaoLoginBtn';
import NaverLoginBtn from '../components/login/NaverLoginBtn';
import GoogleLoginBtn from '../components/login/GoogleLoginBtn';
import Panel from '../components/layout/Panel';
import logo from '../assets/images/ribbon-logo.svg';
import { toast } from '../components/toast/ToastProvider';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sns } = useParams();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const handleLogin = useCallback(
    (res) => {
      if (res.data.statusCode === 200) {
        dispatch(setLogin(sns));
        setCookie(res.headers.authorization);
        toast.success(res.data.message);
        navigate('/');
      }
    },
    [dispatch, navigate, sns],
  );

  const kakaoLogin = useCallback(() => {
    authAPI
      .kakaoLogin(code)
      .then((res) => handleLogin(res))
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, [code, handleLogin]);

  const googleLogin = useCallback(() => {
    authAPI
      .googleLogin(code)
      .then((res) => handleLogin(res))
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, [code, handleLogin]);

  const naverLogin = useCallback(() => {
    authAPI
      .naverLogin(code, state)
      .then((res) => handleLogin(res))
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, [code, handleLogin, state]);

  useEffect(() => {
    if (code) {
      switch (sns) {
        case 'kakao':
          kakaoLogin();
          break;
        case 'google':
          googleLogin();
          break;
        case 'naver':
          naverLogin();
          break;
        default:
          break;
      }
    }
  }, [googleLogin, kakaoLogin, naverLogin, sns, code]);

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
