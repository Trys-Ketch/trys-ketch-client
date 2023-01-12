import React from 'react';
import styled from 'styled-components';
import naver from '../../assets/icons/naver-round-icon.png';

function NaverLoginBtn() {
  return (
    <IconBox>
      <a href="/login">
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
