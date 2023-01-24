import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

function FadeInOut({ duration = 1, keyword = '짱구' }) {
  const [content, setContent] = useState(1);
  // const contents = useRef([3, 2, 1, keyword]).current;

  // function changeContent() {
  //   let pointer = 0;
  //   const intervalID = setInterval(() => {
  //     const contents = [3, 2, 1, keyword];
  //     console.log(contents[pointer]);
  //     setContent(contents[pointer]);
  //     pointer += 1;
  //     console.log('content changed: ', content);
  //     if (pointer === contents.length) clearInterval(intervalID);
  //   }, duration * 1000);
  // }

  useEffect(() => {
    // changeContent();
    setContent(123);
    setContent(456);
  }, []);

  return (
    <Background>
      <Contents style={{ animationDuration: `${duration / 2}s` }}>{content}</Contents>
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
