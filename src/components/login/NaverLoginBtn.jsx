import React from 'react';
import naver from '../../assets/icons/naver-icon.svg';
import LoginButton from '../common/LoginButton';
import { LOGIN_URL } from '../../helper/constants';

function NaverLoginBtn() {
  return <LoginButton src={naver} sns="naver" url={LOGIN_URL.NAVER_LOGIN_URL} />;
}

export default NaverLoginBtn;
