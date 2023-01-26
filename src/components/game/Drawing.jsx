import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import IconButton from '../common/IconButton';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import undo from '../../assets/icons/undo-icon.svg';
import redo from '../../assets/icons/redo-icon.svg';
import FloatBox from '../layout/FloatBox';
import SettingButton from '../button/SettingButton';
import MikeButton from '../button/MikeButton';
import useTimer from '../../hooks/useTimer';
import CircleTimer from './CircleTimer';

const CIRCLE_RADIUS = 40;
const CENTER = 40;
const TIME_LIMIT = 60 * 1000;
const STROKE_WIDTH = 3;

function Drawing({
  submitNum,
  maxSubmitNum,
  round,
  toggleReady,
  isSubmitted,
  submitImg,
  keyword,
  completeImageSubmit,
}) {
  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const pathRef = useRef(null);

  useTimer(pathRef, CENTER, CIRCLE_RADIUS, STROKE_WIDTH, TIME_LIMIT);

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton />
            <MikeButton />
          </>
        }
      />
      <Container style={{ paddingLeft: '0px', height: '680px', width: '1200px' }}>
        <LeftDiv>
          <CircleTimer
            strokeWidth={STROKE_WIDTH}
            circleRadius={CIRCLE_RADIUS}
            center={CENTER}
            pathRef={pathRef}
            round={round}
          />
          <IconButtonContainer>
            <IconButton onClick={() => undoRef.current()} size="xlarge" icon={undo} />
            <IconButton
              onClick={() => redoRef.current()}
              style={{ marginTop: '15px', marginBottom: '10px' }}
              size="xlarge"
              icon={redo}
            />
          </IconButtonContainer>
        </LeftDiv>
        <Paint
          completeImageSubmit={completeImageSubmit}
          isSubmitted={isSubmitted}
          keyword={keyword}
          undoRef={undoRef}
          redoRef={redoRef}
          toggleReady={toggleReady}
          submitImg={submitImg}
        />
      </Container>
    </>
  );
}

const IconButtonContainer = styled.div`
  position: absolute;
  transform: translate(-50%, 0);
  bottom: 0;
  left: 50%;
`;

const LeftDiv = styled.div`
  position: relative;
  height: 100%;
  width: 10%;
`;

export default Drawing;
