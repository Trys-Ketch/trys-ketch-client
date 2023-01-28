import React from 'react';
import styled from 'styled-components';

function LoginButton({ src, sns, url }) {
  const handleLogin = () => {
    window.location.href = url;
  };

  return (
    <StLoginButton onClick={handleLogin}>
      <img src={src} alt={sns} />
    </StLoginButton>
  );
}

const StLoginButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  block-size: fit-content;
  cursor: pointer;

  & img {
    width: 50px;
    height: 50px;
  }
`;

export default LoginButton;
