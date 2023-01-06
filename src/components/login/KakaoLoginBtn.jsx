import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import kakao from '../../assets/icons/kakao_login.svg';
import authAPI from '../../api/auth';
import { setCookie } from '../../utils/cookie';

// TODO - test용 컴포넌트 추후 디자인 시안에 따라 변경 필요
function KakaoLoginBtn() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login&response_type=code`;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get('code');

  const KakaoLogin = useCallback(async () => {
    await authAPI
      .KakaoLogin(code)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setCookie(res.headers.authorization);
          alert(res.data.message);
          navigate('/');
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => alert(error.message));
  }, [code, navigate]);

  useEffect(() => {
    if (code) {
      KakaoLogin();
    }
  }, [KakaoLogin, code]);

  return (
    <KakaoBox>
      <a href={KAKAO_AUTH_URL}>
        <img src={kakao} alt="kakao login" />
      </a>
      <Caption>kakao</Caption>
    </KakaoBox>
  );
}

const KakaoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
`;

const Caption = styled.p`
  width: 100%;
  color: #939393;
  font-weight: 600;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  margin-top: 5px;
  margin-bottom: 15px;
`;

export default KakaoLoginBtn;
