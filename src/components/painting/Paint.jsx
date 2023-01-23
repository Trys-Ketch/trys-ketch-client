import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import getStoredState from 'redux-persist/es/getStoredState';
import floodFill from '../../utils/floodFill';
import Button from '../common/Button';
import eraser from '../../assets/icons/eraser-icon.svg';
import pencil from '../../assets/icons/pencil-icon.svg';
import paint from '../../assets/icons/paint-icon.svg';
import pencilThickness from '../../assets/icons/thickness-icon.svg';
import IconButton from '../common/IconButton';

let historyPointer = 0;
let currentColor = 'black';
let isMounted = false;

function Paint({
  toggleReady,
  keyword = '이거 발견하면 ㄹㅇ 천재 ㅇㅈ',
  isSubmitted,
  submitImg,
  undoRef,
  redoRef,
}) {
  const thickness = [5, 7, 9, 11, 13];
  const color = [
    '#8B4513',
    '#B9062F',
    '#CD0000',
    '#FF1493',
    '#006400',
    '#2E8B57',
    '#FFB400',
    '#FF8200',
    '#D2691E',
    '#9932CC',
    `#800080`,
    '#0000FF',
    '#00008C',
    '#000000',
  ];
  const opacity = ['1A', '33', '4D', '66', '80', '99', 'B3', 'CC', 'E6', 'FF']; // hex코드용 opacity
  // const opacity = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // rgba용 opacity

  const canvasRef = useRef(null);

  const [ctx, setCtx] = useState();
  const [isDrawing, setIsDrawing] = useState();
  const [eventState, setEventState] = useState('drawing');
  const [displayThicknessBtn, setDisplayThicknessBtn] = useState(false);
  const [nowThickness, setNowThickness] = useState(0);

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
    setEventState('drawing');
    setCtx(context);
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
    const rgb = hexToRgb(ctx.strokeStyle);
    floodFill(ctx, offsetX, offsetY, [rgb[0], rgb[1], rgb[2], 255]);
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
    let key = 0;
    for (let i = 0; i < 14; i += 1) {
      key = i;
      result.push(
        <Spring key={key} style={{ top: `${i * 37.5}px` }}>
          <SpringLine />
          <SpringCircle />
        </Spring>,
      );
    }
    return result;
  }

  useEffect(() => {
    if (ctx && !isMounted) {
      undoRef.current = undo;
      redoRef.current = redo;
      isMounted = true;
    }
  }, [ctx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = thickness[0] * 2;

    setCtx(() => context);
  }, []);

  return (
    <Wrapper>
      <CanvasArea>
        <KeywordDiv>
          <Keyword>{keyword}</Keyword>
        </KeywordDiv>
        <CanvasWrapper>
          {drawSpring()}
          <Canvas
            ref={canvasRef}
            onClick={(event) => {
              if (eventState === 'drawing') drawCircle(event);
            }}
            onMouseDown={(event) => {
              history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
              historyPointer += 1;
              history.splice(historyPointer);
              if (eventState === 'drawing') {
                startDrawing();
              }
              if (eventState === 'fill') {
                fill(event);
              }
            }}
            onMouseUp={() => {
              if (eventState === 'drawing') {
                finishDrawing();
              }
            }}
            onMouseMove={(event) => {
              if (eventState === 'drawing') {
                drawing(event);
              }
            }}
            onMouseLeave={() => {
              if (eventState === 'drawing') {
                finishDrawing();
              }
            }}
          />
        </CanvasWrapper>
      </CanvasArea>

      <RightDiv>
        {displayThicknessBtn && (
          <ThicknessBtnWrapper
            style={{
              right: `${-(35 + thickness[thickness.length - 1] * 3)}px`,
            }}
          >
            {thickness.map((v, i) => {
              return (
                <ThicknessBtn
                  key={v}
                  style={{
                    width: `${v * 3}px`,
                    height: `${v * 3}px`,
                  }}
                  onClick={() => {
                    setThickness(v * 2);
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
        <IconButtonWrapper>
          <IconButton
            onClick={() => {
              setDrawing();
            }}
            icon={pencil}
            size="large"
          />
          <IconButton onClick={() => setEraser()} icon={eraser} size="large" />
          <IconButton onClick={() => setEventState('fill')} icon={paint} size="large" />
          <IconButton onClick={() => toggleThicknessBtn()} icon={pencilThickness} size="large" />
        </IconButtonWrapper>
        <ColorBtnWrapper>
          {color.map((v) => {
            return (
              <ColorBtn
                key={v}
                style={{ backgroundColor: v }}
                onClick={() => {
                  setColor(v);
                }}
              />
            );
          })}
        </ColorBtnWrapper>
        {/* <BtnWrapper>
          {opacity.map((v) => {
            return (
              <OpacityBtn
                key={v}
                style={{ backgroundColor: `#000000${v}` }}
                onClick={() => setOpacity(v)}
              />
            );
          })}
        </BtnWrapper> */}
        <Button
          style={{
            position: 'absolute',
            bottom: '0',
            height: '11%',
            width: '100%',
          }}
          onClick={toggleReady}
        >
          <div style={{ fontSize: `${({ theme }) => theme.fontSizes.xl}` }}>
            {isSubmitted ? '취소' : '제출'}
          </div>
        </Button>
      </RightDiv>
    </Wrapper>
  );
}

const ColorBtnWrapper = styled.div`
  padding: 3px 13px;
  margin-top: 15px;
  width: 100%;
  height: 50%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-bottom: 8px solid ${({ theme }) => theme.colors.DIM_GRAY};
  border-radius: 16px;
  place-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(7, 1fr);
`;

// const OpacityBtn = styled.button`
//   padding: 10px;
//   margin-right: 5px;
//   box-sizing: content-box;
//   border: none !important;
//   background-color: black;
//   border-radius: 50%;
// `;

const ColorBtn = styled.button`
  padding: 10px;
  width: 15px;
  height: 15px;
  box-sizing: content-box;
  border: none !important;
  background-color: black;
  border-radius: 50%;
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
  gap: 5px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
`;

const CanvasWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  height: 83%;
  width: 100%;
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

const KeywordDiv = styled.div`
  line-height: 100%;
  width: 100%;
  height: 15%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
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
`;

export default Paint;
