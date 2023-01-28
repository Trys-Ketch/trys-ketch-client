import React from 'react';
import naver from '../../assets/icons/naver-icon.svg';
import LoginButton from '../common/LoginButton';

function NaverLoginBtn() {
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&state=${process.env.REACT_APP_NAVER_STATE}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/naver`;

  return <LoginButton src={naver} sns="naver" url={NAVER_AUTH_URL} />;
}

export default NaverLoginBtn;
