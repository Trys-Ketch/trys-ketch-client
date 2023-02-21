import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { useCookies } from 'react-cookie';
import { setForceSubmit } from '../../app/slices/ingameSlice';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Tooltip from '../common/Tooltip';
import { toast } from '../toast/ToastProvider';
import eraser from '../../assets/icons/eraser-icon.svg';
import pencil from '../../assets/icons/pencil-icon.svg';
import paint from '../../assets/icons/paint-icon.svg';
import pencilThickness from '../../assets/icons/thickness-icon.svg';
import undoIcon from '../../assets/icons/undo-icon.svg';
import redoIcon from '../../assets/icons/redo-icon.svg';
import useCtx from '../../hooks/useCtx';
import { setThickness, setColor, setEraser, setDrawing, undo, redo } from '../../utils/paintUtils';
import { EVENT_STATE, PAINT_OPTION } from '../../helper/constants';
import KeywordArea from './KeywordArea';
import CanvasWrapper from './CanvasWrapper';
import { store } from '../../app/configStore';
import useUndoEvent from '../../hooks/useUndoEvent';

let token;

function Paint({
  isKeywordState,
  isGuessingState,
  isDrawingState,
  isPracticeState,
  toggleReady,
  keyword = '연습장',
  setKeyword,
  isSubmitted,
  submitImg,
  completeImageSubmit,
  image,
}) {
  const { thickness, color } = PAINT_OPTION;
  const [eventState, setEventState] = useState(EVENT_STATE.DRAWING);
  const [ctx, setCtx] = useState(null);
  const [displayThicknessBtn, setDisplayThicknessBtn] = useState(false);
  const [nowThickness, setNowThickness] = useState(2);
  const [selectedColorIndex, setSelectedColorIndex] = useState(color.length - 1);
  const currentColor = useRef('black');
  const historyPointer = useRef(0);

  const dispatch = useDispatch();
  const forceSubmit = useSelector((state) => state.ingame.forceSubmit);
  const history = useRef([]).current;

  const canvasRef = useCtx(
    setCtx,
    isDrawingState,
    thickness,
    history,
    setEventState,
    setDisplayThicknessBtn,
    setNowThickness,
    setSelectedColorIndex,
    color,
    currentColor,
    historyPointer,
  );
  useUndoEvent(undo, historyPointer, history, ctx, isDrawingState);

  /**
   * 선 굵기를 선택하는 모달을 보여지게/안보여지게 하는 함수입니다.
   */
  function toggleThicknessBtn() {
    setDisplayThicknessBtn((prev) => !prev);
  }

  useEffect(() => {
    if (completeImageSubmit) {
      const canvas = canvasRef.current;
      submitImg(canvas);
    }
  }, [completeImageSubmit]);

  useEffect(() => {
    if (forceSubmit && isDrawingState && !isSubmitted) {
      const canvas = canvasRef.current;
      toggleReady(canvas, false);
    } else if (forceSubmit && (isKeywordState || isGuessingState) && !isSubmitted) {
      toggleReady(false);
    }
    dispatch(setForceSubmit(false));
  }, [forceSubmit]);

  function canvasToBlob() {
    return new Promise((resolve) => {
      canvasRef.current.toBlob(resolve);
    });
  }

  function saveImage() {
    canvasToBlob().then((blob) => {
      saveAs(blob, 'trys-ketch-practice.png');
    });
  }

  return (
    <Wrapper>
      <CanvasArea>
        <KeywordArea
          isDrawingState={isDrawingState}
          keyword={keyword}
          isKeywordState={isKeywordState}
          isGuessingState={isGuessingState}
          setKeyword={setKeyword}
          isSubmitted={isSubmitted}
        />
        <CanvasWrapper
          isDrawingState={isDrawingState}
          isSubmitted={isSubmitted}
          canvasRef={canvasRef}
          eventState={eventState}
          ctx={ctx}
          setCtx={setCtx}
          history={history}
          historyPointer={historyPointer}
          image={image}
          isGuessingState={isGuessingState}
          isKeywordState={isKeywordState}
        />
      </CanvasArea>

      <RightDiv>
        {isDrawingState && displayThicknessBtn && (
          <ThicknessBtnWrapper
            style={{
              right: `${-(35 + (thickness.length - 1 + 6) * 3)}px`,
            }}
          >
            {thickness
              .map((v, i) => {
                return 6 + i;
              })
              .map((v, i) => {
                return (
                  <ThicknessBtn
                    key={v}
                    style={{
                      width: `${v * 3}px`,
                      height: `${v * 3}px`,
                    }}
                    onClick={() => {
                      setThickness(thickness[i] * 2, canvasRef, setCtx, eventState);
                      setNowThickness(() => i);
                      if (eventState === EVENT_STATE.FILL)
                        setDrawing(canvasRef, currentColor.current, setEventState, setCtx);
                    }}
                  >
                    <ThicknessCircle key={v} style={{ width: `${v * 2}px`, height: `${v * 2}px` }}>
                      {nowThickness === i && (
                        <InnerThicknessCircle
                          style={{ width: `${v * 2 - 6}px`, height: `${v * 2 - 6}px` }}
                        />
                      )}
                    </ThicknessCircle>
                  </ThicknessBtn>
                );
              })}
          </ThicknessBtnWrapper>
        )}
        {isDrawingState && (
          <IconButtonWrapper>
            <Tooltip message="연필">
              <IconButton
                selected={eventState === EVENT_STATE.DRAWING}
                onClick={() => {
                  setDrawing(canvasRef, currentColor.current, setEventState, setCtx);
                }}
                icon={pencil}
                size="large"
              />
            </Tooltip>
            <Tooltip message="지우개">
              <IconButton
                selected={eventState === EVENT_STATE.ERASEING}
                onClick={() => setEraser(canvasRef, setEventState, setCtx)}
                icon={eraser}
                size="large"
              />
            </Tooltip>
            <Tooltip message="채우기">
              <IconButton
                selected={eventState === EVENT_STATE.FILL}
                onClick={() => setEventState(EVENT_STATE.FILL)}
                icon={paint}
                size="large"
              />
            </Tooltip>
            <Tooltip message="펜 굵기">
              <IconButton
                selected={displayThicknessBtn}
                onClick={() => toggleThicknessBtn()}
                icon={pencilThickness}
                size="large"
              />
            </Tooltip>
          </IconButtonWrapper>
        )}
        {isDrawingState && (
          <ColorBtnWrapper>
            {color.map((v, i) => {
              return (
                <ColorBtn
                  selected={selectedColorIndex === i && eventState !== EVENT_STATE.ERASEING}
                  disabled={eventState === EVENT_STATE.ERASEING || isSubmitted}
                  key={v}
                  style={{ backgroundColor: v }}
                  onClick={() => {
                    setColor(v, canvasRef, setCtx);
                    currentColor.current = v;
                    setSelectedColorIndex(i);
                  }}
                />
              );
            })}
          </ColorBtnWrapper>
        )}
        {isDrawingState && (
          <UndoRedoWrapper>
            <Tooltip message="취소하기">
              <IconButton
                disabled={isSubmitted}
                onClick={() => undo(historyPointer, history, ctx)}
                size="large"
                icon={undoIcon}
              />
            </Tooltip>
            <Tooltip message="되돌리기">
              <IconButton
                disabled={isSubmitted}
                onClick={() => redo(historyPointer, history, ctx)}
                size="large"
                icon={redoIcon}
              />
            </Tooltip>
          </UndoRedoWrapper>
        )}
        {isDrawingState && !isPracticeState && (
          <Button
            style={{
              height: '11%',
              width: '100%',
            }}
            onClick={() => {
              toggleReady(canvasRef.current, isSubmitted);
              if (isSubmitted) toast.success('취소되었습니다.');
              else toast.success('제출되었습니다.');
            }}
          >
            <div
              style={{
                fontFamily: 'TTTogether',
                fontSize: `${({ theme }) => theme.fontSizes.xl}`,
              }}
            >
              {isSubmitted ? '취소' : '제출'}
            </div>
          </Button>
        )}
        {(isKeywordState || isGuessingState) && (
          <Button
            style={{
              position: 'absolute',
              bottom: '0',
              height: '11%',
              width: '100%',
            }}
            onClick={() => {
              toggleReady(isSubmitted);
              if (isSubmitted) toast.success('취소되었습니다.');
              else toast.success('제출되었습니다.');
            }}
          >
            <div
              style={{
                fontFamily: 'TTTogether',
                fontSize: `${({ theme }) => theme.fontSizes.xl}`,
              }}
            >
              {isSubmitted ? '취소' : '제출'}
            </div>
          </Button>
        )}
        {isPracticeState && (
          <Button
            style={{
              height: '11%',
              width: '100%',
            }}
            onClick={() => {
              saveImage();
              toast.success('저장되었습니다.');
            }}
          >
            <div
              style={{
                fontFamily: 'TTTogether',
                fontSize: `${({ theme }) => theme.fontSizes.xl}`,
              }}
            >
              저장
            </div>
          </Button>
        )}
      </RightDiv>
    </Wrapper>
  );
}
const UndoRedoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ColorBtnWrapper = styled.div`
  padding: 3px 13px;
  width: 100%;
  height: 52%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-bottom: 8px solid ${({ theme }) => theme.colors.DIM_GRAY};
  border-radius: 16px;
  place-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(7, 1fr);
`;

const ColorBtn = styled.button`
  padding: 10px;
  width: 15px;
  height: 15px;
  box-sizing: content-box;
  border-radius: 50%;
  ${(props) =>
    props.selected
      ? css`
          box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.FLORAL_WHITE},
            0 0 0 4px ${({ theme }) => theme.colors.DARK_LAVA};
        `
      : css`
          border: none;
        `}
`;

const ThicknessBtnWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 5px;
  position: absolute;
  top: 75px;
  border-radius: 15px;
`;

const ThicknessBtn = styled.button`
  display: block;
  margin: 0 auto;
  &:hover {
    cursor: pointer;
  }
`;

const ThicknessCircle = styled.div`
  margin: 0 auto;
  position: relative;
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  border: 2px solid ${({ theme }) => theme.colors.DARK_LAVA};
  border-radius: 50%;
`;

const InnerThicknessCircle = styled.div`
  position: absolute;
  ${({ theme }) => theme.common.absoluteCenter};
  background-color: ${({ theme }) => theme.colors.DARK_LAVA};
  border: none;
  border-radius: 50%;
`;

const IconButtonWrapper = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  column-gap: 5px;
  row-gap: 0px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
`;

const CanvasArea = styled.div`
  position: relative;
  width: 89%;
  height: 100%;
  margin-right: 20px;
`;

const RightDiv = styled.div`
  position: relative;
  width: 11%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default React.memo(Paint);
