import React from 'react';
import styled, { css } from 'styled-components';
import info from '../../assets/icons/info-icon.svg';
import useModal from '../../hooks/useModal';
import FlatButton from '../common/FlatButton';

function Difficulty({ disabled, difficulty, sendDifficulty }) {
  const { openModal } = useModal();
  function handleOpenModal() {
    openModal({ type: 'gameMode' });
  }
  return (
    <DifficultyArea>
      <GameModeTextWrapper>
        게임 모드
        <InfoButton onClick={() => handleOpenModal()}>
          <img style={{ width: '23px', height: '23px' }} src={info} alt="info" />
        </InfoButton>
      </GameModeTextWrapper>
      <DifficultyButton
        size="large"
        disabled={disabled}
        selected={difficulty === 'easy'}
        onClick={() => sendDifficulty('easy')}
      >
        EASY
      </DifficultyButton>
      <DifficultyButton
        size="large"
        disabled={disabled}
        selected={difficulty === 'hard'}
        onClick={() => sendDifficulty('hard')}
      >
        HARD
      </DifficultyButton>
    </DifficultyArea>
  );
}

const Box = styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 10px;
`;

const DifficultyArea = styled(Box)`
  height: 45%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
`;

const GameModeTextWrapper = styled.div`
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const InfoButton = styled.button`
  border: none;
  cursor: pointer;
  margin: auto 0;
  margin-left: 5px;
  width: 23px;
  height: 23px;
`;

const DifficultyButton = styled(FlatButton)`
  width: 70%;
  height: 60px;
  margin-top: 10px;

  ${(props) =>
    props.disabled &&
    css`
      cursor: default;
    `}

  ${(props) =>
    props.selected
      ? css`
          opacity: 100%;
        `
      : css`
          opacity: 50%;
        `}
`;

export default Difficulty;
