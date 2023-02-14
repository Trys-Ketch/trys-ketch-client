import React from 'react';
import kakao from '../../assets/icons/kakao-icon.svg';
import LoginButton from '../common/LoginButton';
import { LOGIN_URL } from '../../helper/constants';

function KakaoLoginBtn() {
  return <LoginButton src={kakao} sns="kakao" url={LOGIN_URL.KAKAO_LOGIN_URL} />;
}

export default KakaoLoginBtn;
