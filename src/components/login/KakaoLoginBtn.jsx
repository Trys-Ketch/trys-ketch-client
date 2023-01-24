import React from 'react';
import styled from 'styled-components';
import kakao from '../../assets/icons/kakao-icon.svg';

function KakaoLoginBtn() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/kakao&response_type=code`;

  return (
    <IconBox>
      <a href={KAKAO_AUTH_URL}>
        <img src={kakao} alt="kakao login" />
      </a>
    </IconBox>
  );
}

const IconBox = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: fit-content;
  block-size: fit-content;

  & img {
    width: 50px;
    height: 50px;
  }
`;

export default KakaoLoginBtn;
