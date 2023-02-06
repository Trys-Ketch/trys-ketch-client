import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { saveAs } from 'file-saver';
import Button from '../common/Button';
import eraser from '../../assets/icons/eraser-icon.svg';
import pencil from '../../assets/icons/pencil-icon.svg';
import paint from '../../assets/icons/paint-icon.svg';
import pencilThickness from '../../assets/icons/thickness-icon.svg';
import IconButton from '../common/IconButton';
import { setForceSubmit } from '../../app/slices/ingameSlice';
import TextInput from '../common/TextInput';
import { toast } from '../toast/ToastProvider';
import undoIcon from '../../assets/icons/undo-icon.svg';
import redoIcon from '../../assets/icons/redo-icon.svg';
import Tooltip from '../common/Tooltip';
import useCtx from '../../hooks/useCtx';
import {
  startDrawing,
  finishDrawing,
  drawCircle,
  drawing,
  setThickness,
  setColor,
  setEraser,
  setDrawing,
  fill,
} from '../../utils/paintUtils';

let historyPointer = 0;
let currentColor = 'black';

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
  gameState,
}) {
  const thickness = [2, 3, 4, 6, 8, 10];
  const color = [
    '#8B4513',
    // '#B9062F',
    '#CD0000',
    '#FF1493',
    '#006400',
    '#2E8B57',
    '#FFB400',
    '#fbceb1',
    '#FF8200',
    '#D2691E',
    '#9932CC',
    // '#800080',
    '#0000FF',
    '#00008C',
    '#ffffff',
    '#000000',
  ];
  const opacity = ['1A', '33', '4D', '66', '80', '99', 'B3', 'CC', 'E6', 'FF']; // hex코드용 opacity
  // const opacity = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // rgba용 opacity

  const canvasRef = useRef(null);

  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState();
  const [eventState, setEventState] = useState('drawing');
  const [displayThicknessBtn, setDisplayThicknessBtn] = useState(false);
  const [nowThickness, setNowThickness] = useState(2);
  const [selectedColorIndex, setSelectedColorIndex] = useState(color.length - 1);

  const dispatch = useDispatch();
  const forceSubmit = useSelector((state) => state.ingame.forceSubmit);
  const history = useRef([]).current;

  useCtx(
    canvasRef,
    setCtx,
    isDrawingState,
    thickness,
    history,
    setEventState,
    setDisplayThicknessBtn,
    setNowThickness,
    setSelectedColorIndex,
    color,
  );

  useEffect(() => {
    if (isDrawingState) {
      currentColor = 'black';
      historyPointer = 0;
    }
  }, [isDrawingState]);

  /**
   * 그림판을 이전의 상태로 되돌리는 함수입니다.
   */
  function undo() {
    if (historyPointer === 0) return;
    if (historyPointer === history.length)
      history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    historyPointer -= 1;
    const img = history[historyPointer];
    ctx.putImageData(img, 0, 0);
  }

  /**
   * undo한 그림판을 다시 되돌리는 함수입니다.
   */
  function redo() {
    if (historyPointer >= history.length - 1) return;
    historyPointer += 1;
    const img = history[historyPointer];
    ctx.putImageData(img, 0, 0);
  }

  /**
   * 선 굵기를 선택하는 모달을 보여지게/안보여지게 하는 함수입니다.
   */
  function toggleThicknessBtn() {
    setDisplayThicknessBtn((prev) => !prev);
  }

  /**
   * 왼쪽에 스프링을 꽂는 구멍을 그려주는 함수입니다.
   * @returns {HTMLElement[]}
   */
  function drawSpring() {
    const result = [];
    for (let i = 0; i < 14; i += 1) {
      result.push(
        <Spring key={i} style={{ top: `${i * 37.5}px` }}>
          <SpringLine />
          <SpringCircle />
        </Spring>,
      );
    }
    return result;
  }

  function onKeywordChangeHandler(event) {
    setKeyword(event.target.value);
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

  useEffect(() => {
    function keyPress(e) {
      const evtobj = window.event ? window.event : e;
      if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
        undo();
      }
    }
    if (isDrawingState) document.addEventListener('keydown', keyPress, false);
    else document.removeEventListener('keydown', keyPress, false);
    return () => {
      document.removeEventListener('keydown', keyPress, false);
    };
  }, [isDrawingState, ctx]);

  return (
    <Wrapper>
      <CanvasArea>
        {isDrawingState ? (
          <KeywordDiv style={{ marginBottom: '2%' }}>
            <Keyword>{keyword}</Keyword>
          </KeywordDiv>
        ) : (
          <KeywordDiv style={{ position: 'absolute', bottom: '0' }}>
            <Keyword>
              {isKeywordState && '키워드를 입력해주세요: '}
              {isGuessingState && '정답을 맞춰주세요: '}
              <TextInput
                value={keyword}
                onChange={(event) => onKeywordChangeHandler(event)}
                width="400px"
                backgroundColor="#c9dbaa"
                readOnly={isSubmitted}
              />
            </Keyword>
          </KeywordDiv>
        )}

        <CanvasWrapper isDrawingState={isDrawingState} isSubmitted={isSubmitted}>
          {drawSpring()}
          {isDrawingState && (
            <Canvas
              isSubmitted={isSubmitted}
              ref={canvasRef}
              onClick={(event) => {
                if (eventState === 'drawing' || eventState === 'eraseing') drawCircle(ctx, event);
              }}
              onMouseDown={(event) => {
                history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
                historyPointer += 1;
                history.splice(historyPointer);
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  startDrawing(setIsDrawing);
                }
                if (eventState === 'fill') {
                  fill(canvasRef, setCtx, ctx, event);
                }
              }}
              onMouseUp={() => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  finishDrawing(setIsDrawing);
                }
              }}
              onMouseMove={(event) => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  drawing(ctx, isDrawing, event);
                }
              }}
              onMouseLeave={() => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
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
        </CanvasWrapper>
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
                      setThickness(thickness[i] * 2, canvasRef, setCtx);
                      setNowThickness(() => i);
                      if (eventState === 'fill')
                        setDrawing(canvasRef, currentColor, setEventState, setCtx);
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
                selected={eventState === 'drawing'}
                onClick={() => {
                  setDrawing(canvasRef, currentColor, setEventState, setCtx);
                }}
                icon={pencil}
                size="large"
              />
            </Tooltip>
            <Tooltip message="지우개">
              <IconButton
                selected={eventState === 'eraseing'}
                onClick={() => setEraser(canvasRef, setEventState, setCtx)}
                icon={eraser}
                size="large"
              />
            </Tooltip>
            <Tooltip message="채우기">
              <IconButton
                selected={eventState === 'fill'}
                onClick={() => setEventState('fill')}
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
                  selected={selectedColorIndex === i && eventState !== 'eraseing'}
                  disabled={eventState === 'eraseing' || isSubmitted}
                  key={v}
                  style={{ backgroundColor: v }}
                  onClick={() => {
                    setColor(v, canvasRef, setCtx);
                    currentColor = v;
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
                onClick={() => undo()}
                size="large"
                icon={undoIcon}
              />
            </Tooltip>
            <Tooltip message="되돌리기">
              <IconButton
                disabled={isSubmitted}
                onClick={() => redo()}
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

const Image = styled.img`
  background-color: white;
  width: 100%;
  height: 100%;
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
  /* box-shadow: 0 0 0 2px #ff0000, 0 0 0 4px #0000ff; */
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

const KeywordDiv = styled.div`
  line-height: 100%;
  width: 100%;
  height: 15%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

const CanvasWrapper = styled.div`
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

const Keyword = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  text-align: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const Spring = styled.div`
  position: absolute;
  left: 0;
  padding: 9.8px 0;
  display: flex;
`;

const SpringLine = styled.div`
  margin: auto 0;
  width: 8px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.TEA_GREEN};
  z-index: 2;
`;

const SpringCircle = styled.div`
  margin: auto 0;
  padding: 9px;
  width: 5px;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.TEA_GREEN};
  border-radius: 50%;
  z-index: 2;
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

export default React.memo(Paint);
