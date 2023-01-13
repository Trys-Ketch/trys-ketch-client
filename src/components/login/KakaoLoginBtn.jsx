import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import kakao from '../../assets/icons/kakao-icon.svg';
import authAPI from '../../api/auth';
import { setCookie } from '../../utils/cookie';
import { setLogin } from '../../app/slices/loginSlice';

function KakaoLoginBtn() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login&response_type=code`;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const code = searchParams.get('code');

  const kakaoLogin = useCallback(async () => {
    await authAPI
      .kakaoLogin(code)
      .then((res) => {
        if (res.data.statusCode === 200) {
          dispatch(setLogin('kakao'));
          setCookie(res.headers.authorization);
          alert(res.data.message);
          navigate('/');
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => alert(error.message));
  }, [code, dispatch, navigate]);

  useEffect(() => {
    if (code) {
      kakaoLogin();
    }
  }, [kakaoLogin, code]);

  return (
    <IconBox>
      <a href={KAKAO_AUTH_URL}>
        <img src={kakao} alt="kakao login" />
      </a>
    </IconBox>
  );
}

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  block-size: fit-content;

  & img {
    width: 50px;
    height: 50px;
  }
`;

export default KakaoLoginBtn;
