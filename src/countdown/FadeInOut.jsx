import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

function FadeInOut({ startTime, duration, contents }) {
  const [startFadeAnimation, setStartFadeAnimation] = useState(false);
  function fadein() {
    setTimeout(() => {
      setStartFadeAnimation(true);
    }, startTime);
  }

  useEffect(() => {
    fadein();
  }, []);
  return (
    <Background>
      {startFadeAnimation && (
        <Contents style={{ animationDuration: `${duration / 2}s` }}>{contents}</Contents>
      )}
    </Background>
  );
}

const Background = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.2);
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Contents = styled.div`
  width: max-content;
  height: max-content;
  font-family: 'TTTogether';
  font-size: 50px;
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  animation-name: ${fadeIn};
  animation-direction: alternate;
  animation-iteration-count: 2;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  ${({ theme }) => theme.common.absoluteCenter};
`;

export default FadeInOut;
