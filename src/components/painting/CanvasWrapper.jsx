import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { drawCircle, drawing, fill, finishDrawing, startDrawing } from '../../utils/paintUtils';
import DrawSpring from './DrawSpring';
import { EVENT_STATE } from '../../helper/constants';

function CanvasWrapper({
  isDrawingState,
  isSubmitted,
  canvasRef,
  eventState,
  ctx,
  setCtx,
  history,
  historyPointer,
  image,
  isGuessingState,
  isKeywordState,
}) {
  const [isDrawing, setIsDrawing] = useState();
  return (
    <Container isDrawingState={isDrawingState} isSubmitted={isSubmitted}>
      <DrawSpring />
      {isDrawingState && (
        <Canvas
          isSubmitted={isSubmitted}
          ref={canvasRef}
          onClick={(event) => {
            if (eventState === EVENT_STATE.DRAWING || eventState === EVENT_STATE.ERASEING)
              drawCircle(ctx, event);
          }}
          onMouseDown={(event) => {
            history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
            historyPointer.current += 1;
            history.splice(historyPointer.current);
            if (eventState === EVENT_STATE.DRAWING || eventState === EVENT_STATE.ERASEING) {
              startDrawing(setIsDrawing);
            }
            if (eventState === EVENT_STATE.FILL) {
              fill(canvasRef, setCtx, ctx, event);
            }
          }}
          onMouseUp={() => {
            if (eventState === EVENT_STATE.DRAWING || eventState === EVENT_STATE.ERASEING) {
              finishDrawing(setIsDrawing);
            }
          }}
          onMouseMove={(event) => {
            if (eventState === EVENT_STATE.DRAWING || eventState === EVENT_STATE.ERASEING) {
              drawing(ctx, isDrawing, event);
            }
          }}
          onMouseLeave={() => {
            if (eventState === EVENT_STATE.DRAWING || eventState === EVENT_STATE.ERASEING) {
              finishDrawing(setIsDrawing);
            }
          }}
        />
      )}
      {isGuessingState && (
        <ImageWrapper>
          <KeywordBackground>
            <Image src={image} alt={nanoid()} />
          </KeywordBackground>
        </ImageWrapper>
      )}
      {isKeywordState && (
        <ImageWrapper>
          <KeywordBackground />
        </ImageWrapper>
      )}
    </Container>
  );
}

const Image = styled.img`
  background-color: white;
  width: 100%;
  height: 100%;
`;

const KeywordBackground = styled.div`
  position: relative;
  background-color: white;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  font-family: 'TTTogether';
`;

const Canvas = styled.canvas`
  position: relative;
  background-color: white;
  ${(props) =>
    props.isSubmitted
      ? css`
          background-color: rgba(0, 0, 0, 0.2);
          pointer-events: none;
        `
      : css`
          pointer-events: auto;
        `}
`;

const Container = styled.div`
  display: flex;
  height: 83%;
  width: 100%;
  position: relative;
  background-color: white;
  ${(props) =>
    props.isSubmitted && props.isDrawingState
      ? css`
          &:hover {
            cursor: not-allowed;
          }
        `
      : css`
          &:hover {
            cursor: default;
          }
        `}
`;

export default CanvasWrapper;
