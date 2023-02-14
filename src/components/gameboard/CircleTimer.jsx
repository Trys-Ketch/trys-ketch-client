import React from 'react';
import styled from 'styled-components';
import Round from './Round';
import useTimer from '../../hooks/useTimer';
import { TIMER_CONST } from '../../helper/constants';

const { CIRCLE_RADIUS, CENTER, STROKE_WIDTH } = TIMER_CONST;

function CircleTimer({ timeLimit, gameState, round }) {
  const pathRef = useTimer(CENTER, CIRCLE_RADIUS, STROKE_WIDTH, timeLimit, gameState);

  return (
    <TimerBorder
      style={{
        border: `${STROKE_WIDTH}px solid #4e473f`,
        height: `${CIRCLE_RADIUS * 2}px`,
        width: `${CIRCLE_RADIUS * 2}px`,
      }}
    >
      <Timer>
        <path ref={pathRef} fill="#4e473f" />
        <circle cx={CENTER - STROKE_WIDTH} cy={CENTER - STROKE_WIDTH} r="18px" fill="#c9dbaa" />
      </Timer>
      <Round round={round} />
    </TimerBorder>
  );
}

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
`;

export default CircleTimer;
