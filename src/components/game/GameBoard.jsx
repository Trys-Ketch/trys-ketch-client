import React from 'react';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import FloatBox from '../layout/FloatBox';
import QuitButton from '../button/QuitButton';
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
    <>
      <FloatBox bottom={<QuitButton size="xlarge" />} />
      <Container style={{ paddingLeft: '0px', height: '680px', width: '1200px' }}>
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
          gameState={gameState}
        />
      </Container>
    </>
  );
}

export default GameBoard;
