import React from 'react';
import styled from 'styled-components';
import google from '../../assets/icons/google-icon.svg';

function GoogleLoginBtn() {
  const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`;

  return (
    <IconBox>
      <a href={GOOGLE_LOGIN_URL}>
        <img src={google} alt="google login" />
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

export default GoogleLoginBtn;
