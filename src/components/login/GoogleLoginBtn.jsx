import React from 'react';
import google from '../../assets/icons/google-icon.svg';
import LoginButton from '../common/LoginButton';

function GoogleLoginBtn() {
  const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`;

  return <LoginButton src={google} sns="google" url={GOOGLE_LOGIN_URL} />;
}

export default GoogleLoginBtn;
