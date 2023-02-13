import React from 'react';
import styled from 'styled-components';

/**
 * 왼쪽에 스프링을 꽂는 구멍을 그려주는 함수입니다.
 * @returns {HTMLElement[]}
 */
function drawSpring() {
  const result = [];
  for (let i = 0; i < 14; i += 1) {
    result.push(
      <Spring key={i} style={{ top: `${i * 37.5}px` }}>
        <SpringLine />
        <SpringCircle />
      </Spring>,
    );
  }
  return result;
}

const Spring = styled.div`
  position: absolute;
  left: 0;
  padding: 9.8px 0;
  display: flex;
`;

const SpringLine = styled.div`
  margin: auto 0;
  width: 8px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.TEA_GREEN};
  z-index: 2;
`;

const SpringCircle = styled.div`
  margin: auto 0;
  padding: 9px;
  width: 5px;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.TEA_GREEN};
  border-radius: 50%;
  z-index: 2;
`;

export default drawSpring;
