import React from 'react';
import styled from 'styled-components';

function CircleTimer({ strokeWidth, circleRadius, center, pathRef, round }) {
  return (
    <TimerBorder
      style={{
        border: `${strokeWidth}px solid #4e473f`,
        height: `${circleRadius * 2}px`,
        width: `${circleRadius * 2}px`,
      }}
    >
      <Timer>
        <path ref={pathRef} fill="#4e473f" />
        <circle cx={center - strokeWidth} cy={center - strokeWidth} r="18px" fill="#c9dbaa" />
      </Timer>
      <Round>{round}</Round>
    </TimerBorder>
  );
}

const Round = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const TimerBorder = styled.div`
  position: relative;
  border-radius: 50%;
  /* border: 3px solid ${({ theme }) => theme.colors.DARK_LAVA}; */
  margin: 0 auto;
  margin-top: 15px;
`;

const Timer = styled.svg`
  width: 80px;
  height: 80px;
  /* ${({ theme }) => theme.common.absoluteCenter}; */
`;

export default CircleTimer;
