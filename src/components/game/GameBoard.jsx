import React from 'react';
import styled from 'styled-components';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import LeftDiv from '../gameboard/LeftDiv.';

function GameBoard({
  isKeywordState,
  isGuessingState,
  isDrawingState,
  isPracticeState,
  submitNum,
  maxSubmitNum,
  round,
  timeLimit,
  toggleReady,
  isSubmitted,
  submitImg,
  keyword,
  completeImageSubmit,
  setKeyword,
  image,
  gameState,
}) {
  return (
    <Board>
      <LeftDiv
        isPracticeState={isPracticeState}
        round={round}
        submitNum={submitNum}
        maxSubmitNum={maxSubmitNum}
        timeLimit={timeLimit}
        gameState={gameState}
      />
      <Paint
        isKeywordState={isKeywordState}
        isGuessingState={isGuessingState}
        isDrawingState={isDrawingState}
        isPracticeState={isPracticeState}
        submitNum={submitNum}
        maxSubmitNum={maxSubmitNum}
        round={round}
        timeLimit={timeLimit}
        completeImageSubmit={completeImageSubmit}
        isSubmitted={isSubmitted}
        keyword={keyword}
        setKeyword={setKeyword}
        toggleReady={toggleReady}
        submitImg={submitImg}
        image={image}
      />
    </Board>
  );
}

const Board = styled(Container)`
  padding-left: 0px;
  height: 680px;
  width: 1200px;
`;

export default GameBoard;
