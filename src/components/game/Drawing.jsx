import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import IconButton from '../common/IconButton';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import undo from '../../assets/icons/undo-icon.svg';
import redo from '../../assets/icons/redo-icon.svg';
import FloatBox from '../layout/FloatBox';
import SettingButton from '../button/SettingButton';
import MikeButton from '../button/MikeButton';

const CIRCLE_RADIUS = 40;
const CENTER = 40;

function Drawing({ toggleReady, isSubmitted, setIsSubmitted, submitImg, keyword }) {
  const undoRef = useRef(null);
  const redoRef = useRef(null);
  const circleRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(
      ' ',
    );

    return d;
  }

  useEffect(() => {
    pathRef.current.setAttribute(
      'd',
      describeArc(CENTER - 3, CENTER - 3, CIRCLE_RADIUS - 6, 0, 180),
    );
  }, []);

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
          <TimerBorder
            style={{ height: `${CIRCLE_RADIUS * 2}px`, width: `${CIRCLE_RADIUS * 2}px` }}
          >
            <Timer ref={svgRef}>
              <path ref={pathRef} fill="#4e473f" />
              {/* <circle
                ref={circleRef}
                cx={`${CENTER - 3}px`}
                cy={`${CENTER - 3}px`}
                r={`${CIRCLE_RADIUS - 6}px`}
                fill="#4e473f"
              /> */}
            </Timer>
          </TimerBorder>
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
const TimerBorder = styled.div`
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.DARK_LAVA};
  margin: 0 auto;
  margin-top: 15px;
`;

const Timer = styled.svg`
  width: 80px;
  height: 80px;
  /* ${({ theme }) => theme.common.absoluteCenter}; */
`;

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
