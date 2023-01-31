import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import floodFill from '../../utils/floodFill';
import Button from '../common/Button';
import eraser from '../../assets/icons/eraser-icon.svg';
import pencil from '../../assets/icons/pencil-icon.svg';
import paint from '../../assets/icons/paint-icon.svg';
import pencilThickness from '../../assets/icons/thickness-icon.svg';
import IconButton from '../common/IconButton';
import { setForceSubmit } from '../../app/slices/ingameSlice';
import TextInput from '../common/TextInput';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';
import undoIcon from '../../assets/icons/undo-icon.svg';
import redoIcon from '../../assets/icons/redo-icon.svg';
import Tooltip from '../common/Tooltip';

let historyPointer = 0;
let currentColor = 'black';

function Paint({
  isKeywordState,
  isGuessingState,
  isDrawingState = true,
  toggleReady,
  keyword = '이거 발견하면 ㄹㅇ 천재 ㅇㅈ',
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

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  /**
   * 선을 그리는 함수입니다.
   * @param {event} param0
   */
  const drawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (ctx) {
      if (!isDrawing) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
  };

  /**
   * 원을 그리는 함수입니다.
   * canvas에 클릭을 하고 마우스를 움직이지 않으면 아무것도 그려지지 않아 undo와 redo를 했을 때 동작하지 않는 것 처럼 보입니다.
   * 이를 해결해기 위해 onclick시 펜의 굵기와 같은 반지름으로 원을 그려지게 하였습니다.
   * @param {event} nativeEvent 이벤트 객체
   */
  const drawCircle = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (ctx) {
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, ctx.lineWidth / 64, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }
  };

  /**
   * hex코드를 받아 rgb값으로 변환해주는 함수입니다.
   * @param {string} hex #XXXXXX형태의 hex코드입니다.
   * @returns {Array} 정수 값의 rgb가 담긴 배열
   */
  const hexToRgb = (hex) =>
    hex
      .replace(/^#?([A-F\d])([A-F\d])([A-F\d])$/i, (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));

  /**
   * rgb코드를 받아 hex코드를 반환하는 함수입니다.
   * @param {short} r red값
   * @param {short} g green값
   * @param {short} b blue값
   * @returns {String} #XXXXXX형태의 hex코드
   */
  const rgbToHex = (r, g, b) =>
    `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('')}`;

  /**
   * 선의 굵기를 지정하는 함수입니다.
   * @param {int} pixel
   */
  function setThickness(pixel) {
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = pixel;
    setCtx(context);
    GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.Thickness);
  }

  /**
   * 선의 색상을 지정하는 함수입니다.
   * hex코드 또는 rgb(x, x, x)의 형태의 파라미터를 받습니다.
   * @param {string} c
   */
  function setColor(c) {
    currentColor = c;
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = c;
    setCtx(context);
    GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.color, c);
  }

  /**
   * 선의 투명도를 설정하는 함수입니다.
   * 0과 1 사이의 실수를 파라미터로 받습니다.
   * @param {double} op
   */
  function setOpacity(op) {
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle += op;
    const rgb = context.strokeStyle.replace(/[^%,.\d]/g, '').split(',');
    rgb.pop();
    const hex = rgbToHex(rgb[0] * 1, rgb[1] * 1, rgb[2] * 1);
    context.strokeStyle = hex + op;
    setCtx(context);
  }

  /**
   * 그림을 지울 수 있게 하는 함수입니다.
   * 단순히 color를 하얀색으로 만드는 것 과는 조금 다릅니다.
   */
  function setEraser() {
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'destination-out';
    context.strokeStyle = '#ffffff';
    setEventState('eraseing');
    setCtx(context);
    GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.erase);
  }

  /**
   * event state를 drawing으로 바꿔 그림을 그릴 수 있게 하는 함수입니다.
   */
  function setDrawing() {
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = currentColor;
    setEventState('drawing');
    setCtx(context);
    GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.pencil);
  }

  /**
   * 해당 영역을 주어진 색으로 가득 채우는 함수입니다.
   * @param {event} param0
   */
  function fill({ nativeEvent }) {
    const context = canvasRef.current.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    setCtx(context);
    const { offsetX, offsetY } = nativeEvent;

    const hex = ctx.strokeStyle.substring(1);
    const R = hex.substring(0, 2);
    const G = hex.substring(2, 4);
    const B = hex.substring(4, 6);
    floodFill(ctx, offsetX, offsetY, `0xff${B}${G}${R}` * 1);
  }

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
   * @returns {HTMLElement}
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
    if (forceSubmit && isDrawingState) {
      const canvas = canvasRef.current;
      toggleReady(canvas, false);
      dispatch(setForceSubmit(false));
    } else if (forceSubmit && (isKeywordState || isGuessingState)) {
      toggleReady(false);
      dispatch(setForceSubmit(false));
    }
  }, [forceSubmit]);

  useEffect(() => {
    if (isDrawingState) {
      const canvas = canvasRef.current;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext('2d');
      context.strokeStyle = 'black';
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = thickness[2] * 2;
      context.globalCompositeOperation = 'source-over';

      setCtx(() => context);

      currentColor = 'black';

      historyPointer = 0;
      history.splice(0);

      setEventState('drawing');
      setDisplayThicknessBtn(false);
      setNowThickness(2);

      setSelectedColorIndex(color.length - 1);
    }
  }, [isDrawingState]);

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
                if (eventState === 'drawing' || eventState === 'eraseing') drawCircle(event);
              }}
              onMouseDown={(event) => {
                history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
                historyPointer += 1;
                history.splice(historyPointer);
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  startDrawing();
                }
                if (eventState === 'fill') {
                  fill(event);
                }
              }}
              onMouseUp={() => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  finishDrawing();
                }
              }}
              onMouseMove={(event) => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  drawing(event);
                }
              }}
              onMouseLeave={() => {
                if (eventState === 'drawing' || eventState === 'eraseing') {
                  finishDrawing();
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
                      setThickness(thickness[i] * 2);
                      setNowThickness(() => i);
                    }}
                  >
                    <ThicknessCircle key={v} style={{ width: `${v * 2}px`, height: `${v * 2}px` }}>
                      {nowThickness === i && (
                        <InnerThicknessCircle
                          style={{ width: `${v * 2 - 5}px`, height: `${v * 2 - 5}px` }}
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
                  setDrawing();
                }}
                icon={pencil}
                size="large"
              />
            </Tooltip>
            <Tooltip message="지우개">
              <IconButton
                selected={eventState === 'eraseing'}
                onClick={() => setEraser()}
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
            <Tooltip message="펜굵기">
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
                    setColor(v);
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
        {isDrawingState && (
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
              style={{ fontFamily: 'TTTogether', fontSize: `${({ theme }) => theme.fontSizes.xl}` }}
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
              style={{ fontFamily: 'TTTogether', fontSize: `${({ theme }) => theme.fontSizes.xl}` }}
            >
              {isSubmitted ? '취소' : '제출'}
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

const InputWrapper = styled.div`
  width: max-content;
  height: max-content;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 15%;
  font-family: 'TTTogether';
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

const SelectedColorBtn = styled.div`
  padding: 10px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  box-sizing: content-box;
  border: 2px solid ${({ theme }) => theme.colors.DARK_LAVA};
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
