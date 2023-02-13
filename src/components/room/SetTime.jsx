import React from 'react';
import styled from 'styled-components';
import { increaseTime, decreaseTime } from '../../utils/gameRoomStompUtils';
import inc from '../../assets/icons/time-increase-icon.svg';
import dec from '../../assets/icons/time-decrease-icon.svg';

function SetTime({ timeLimit, myState, ingameStompClient, id, token }) {
  function milsecToMinute(milsec) {
    const sec = milsec / 1000;
    const returnMinute = `${Math.floor(sec / 60)}`;
    const returnSec = `${sec % 60}`.length === 1 ? `0${sec % 60}` : `${sec % 60}`;

    return `${returnMinute}:${returnSec}`;
  }

  return (
    <Container>
      <Subtitle>제한 시간</Subtitle>
      <Time>
        {milsecToMinute(timeLimit)}
        <IncDecButtonWrapper>
          <IncDecButton
            disabled={!myState?.isHost || timeLimit === 150000}
            onClick={() => increaseTime(ingameStompClient, id, token)}
            style={{ marginBottom: '2px' }}
          >
            <img src={inc} alt="increase" />
          </IncDecButton>
          <IncDecButton
            disabled={!myState?.isHost || timeLimit === 60000}
            onClick={() => decreaseTime(ingameStompClient, id, token)}
            style={{ marginTop: '2px' }}
          >
            <img src={dec} alt="decrease" />
          </IncDecButton>
        </IncDecButtonWrapper>
      </Time>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25%;
`;

const IncDecButton = styled.button`
  border: none;
  width: max-content;
  height: max-content;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const IncDecButtonWrapper = styled.div`
  margin-left: 10px;
  width: max-content;
  height: max-content;
  display: flex;
  flex-direction: column;
`;

const Time = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 42px;
`;

const Subtitle = styled.h3`
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

export default SetTime;
