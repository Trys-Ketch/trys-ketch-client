import React, { useRef } from 'react';
import styled from 'styled-components';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import useTimer from '../../hooks/useTimer';
import CircleTimer from './CircleTimer';
import SubmittedPlayer from './SubmittedPlayer';
import Tooltip from '../common/Tooltip';
import FloatBox from '../layout/FloatBox';
import QuitButton from '../button/QuitButton';

const CIRCLE_RADIUS = 40;
const CENTER = 40;
const TIME_LIMIT = 60 * 1000;
const STROKE_WIDTH = 3;

function Drawing({
  isKeywordState,
  isGuessingState,
  isDrawingState,
  isPracticeState,
  submitNum,
  maxSubmitNum,
  round = 1,
  timeLimit = 120000,
  toggleReady,
  isSubmitted,
  submitImg,
  keyword,
  completeImageSubmit,
  setKeyword,
  image,
  gameState,
}) {
  const pathRef = useRef(null);

  useTimer(pathRef, CENTER, CIRCLE_RADIUS, STROKE_WIDTH, timeLimit, gameState, isPracticeState);

  return (
    <>
      <FloatBox bottom={<QuitButton size="xlarge" />} />
      <Container style={{ paddingLeft: '0px', height: '680px', width: '1200px' }}>
        <LeftDiv>
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
        </LeftDiv>
        <Paint
          isKeywordState={isKeywordState}
          isGuessingState={isGuessingState}
          isDrawingState={isDrawingState}
          isPracticeState={isPracticeState}
          completeImageSubmit={completeImageSubmit}
          isSubmitted={isSubmitted}
          keyword={keyword}
          setKeyword={setKeyword}
          toggleReady={toggleReady}
          submitImg={submitImg}
          image={image}
          gameState={gameState}
        />
      </Container>
    </>
  );
}

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 10%;
`;

export default Drawing;
