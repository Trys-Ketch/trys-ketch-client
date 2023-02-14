import React from 'react';
import google from '../../assets/icons/google-icon.svg';
import LoginButton from '../common/LoginButton';
import { LOGIN_URL } from '../../helper/constants';

function GoogleLoginBtn() {
  return <LoginButton src={google} sns="google" url={LOGIN_URL.GOOGLE_LOGIN_URL} />;
}

export default GoogleLoginBtn;
