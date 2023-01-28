import React from 'react';
import kakao from '../../assets/icons/kakao-icon.svg';
import LoginButton from '../common/LoginButton';

function KakaoLoginBtn() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/kakao&response_type=code`;

  return <LoginButton src={kakao} sns="kakao" url={KAKAO_AUTH_URL} />;
}

export default KakaoLoginBtn;
