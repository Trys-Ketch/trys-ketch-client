import React from 'react';
import styled from 'styled-components';
import Tooltip from '../common/Tooltip';
import CircleTimer from './CircleTimer';
import SubmittedPlayer from './SubmittedPlayer';

function LeftDiv({ isPracticeState, round, submitNum, maxSubmitNum, timeLimit, gameState }) {
  return (
    <Wrapper>
      {!isPracticeState && (
        <>
          <Tooltip message="타이머/라운드">
            <CircleTimer timeLimit={timeLimit} gameState={gameState} round={round} />
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
