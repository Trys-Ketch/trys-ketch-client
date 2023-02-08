import React from 'react';
import GameBoard from '../components/game/GameBoard';
import FloatBox from '../components/layout/FloatBox';
import QuitButton from '../components/button/QuitButton';

function Practice() {
  return (
    <>
      <FloatBox bottom={<QuitButton size="xlarge" />} />
      <GameBoard isDrawingState isPracticeState />
    </>
  );
}

export default Practice;
