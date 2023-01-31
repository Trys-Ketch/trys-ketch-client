import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '../common/IconButton';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
// import useTimer from '../../hooks/useTimer';
import CircleTimer from './CircleTimer';
import SubmittedPlayer from './SubmittedPlayer';
import Tooltip from '../common/Tooltip';

const CIRCLE_RADIUS = 40;
const CENTER = 40;
const TIME_LIMIT = 60 * 1000;
const STROKE_WIDTH = 3;

function Drawing({
  isKeywordState,
  isGuessingState,
  isDrawingState = true,
  submitNum,
  maxSubmitNum,
  round,
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

  // useTimer(pathRef, CENTER, CIRCLE_RADIUS, STROKE_WIDTH, TIME_LIMIT, gameState);

  return (
    <Container style={{ paddingLeft: '0px', height: '680px', width: '1200px' }}>
      <LeftDiv>
        {/* <CircleTimer
          strokeWidth={STROKE_WIDTH}
          circleRadius={CIRCLE_RADIUS}
          center={CENTER}
          pathRef={pathRef}
          round={round}
        /> */}
        <Tooltip message="제출/총인원">
          <SubmittedPlayer submitNum={submitNum} maxSubmitNum={maxSubmitNum} />
        </Tooltip>
      </LeftDiv>
      <Paint
        isKeywordState={isKeywordState}
        isGuessingState={isGuessingState}
        isDrawingState={isDrawingState}
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
  );
}

const LeftDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  width: 10%;
`;

export default Drawing;
