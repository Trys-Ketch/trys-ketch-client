import React, { useRef } from 'react';
import styled from 'styled-components';
import useTimer from '../../hooks/useTimer';
import Tooltip from '../common/Tooltip';
import CircleTimer from './CircleTimer';
import SubmittedPlayer from './SubmittedPlayer';

const CIRCLE_RADIUS = 40;
const CENTER = 40;
const STROKE_WIDTH = 3;

function LeftDiv({ isPracticeState, round, submitNum, maxSubmitNum, timeLimit, gameState }) {
  const pathRef = useRef(null);

  useTimer(pathRef, CENTER, CIRCLE_RADIUS, STROKE_WIDTH, timeLimit, gameState, isPracticeState);

  return (
    <Wrapper>
      {!isPracticeState && (
        <>
          <Tooltip message="타이머/라운드">
            <CircleTimer
              strokeWidth={STROKE_WIDTH}
              circleRadius={CIRCLE_RADIUS}
              center={CENTER}
              pathRef={pathRef}
              round={round}
            />
          </Tooltip>
          <Tooltip message="제출/총인원">
            <SubmittedPlayer submitNum={submitNum} maxSubmitNum={maxSubmitNum} />
          </Tooltip>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 10%;
`;

export default LeftDiv;
