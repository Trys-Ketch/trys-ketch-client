import React from 'react';
import styled from 'styled-components';
import naver from '../../assets/icons/naver-icon.svg';

function NaverLoginBtn() {
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&state=${process.env.REACT_APP_NAVER_STATE}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/naver`;

  return (
    <IconBox>
      <a href={NAVER_AUTH_URL}>
        <img src={naver} alt="naver login" />
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

export default NaverLoginBtn;
