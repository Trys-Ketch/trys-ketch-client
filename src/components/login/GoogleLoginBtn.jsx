import React from 'react';
import styled from 'styled-components';
import google from '../../assets/icons/google-icon.svg';

function GoogleLoginBtn() {
  return (
    <IconBox>
      <a href="/login">
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
