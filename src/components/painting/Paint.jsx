import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import floodFill from '../../utils/floodFill';

let historyPointer = 0;

function Paint() {
  const thickness = [5, 7.5, 10, 12.5, 15];
  const color = [
    '#0000FF',
    '#00008C',
    '#006400',
    '#2E8B57',
    '#B9062F',
    '#CD0000',
    '#FF1493',
    '#FFB400',
    '#FF8200',
    '#D2691E',
    '#8B4513',
    '#9932CC',
    '#000000',
  ];
  const opacity = ['1A', '33', '4D', '66', '80', '99', 'B3', 'CC', 'E6', 'FF']; // hex코드용 opacity
  // const opacity = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // rgba용 opacity

  const canvasRef = useRef(null);

  const [ctx, setCtx] = useState();
  const [isDrawing, setIsDrawing] = useState();
  const [eventState, setEventState] = useState('drawing');

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
      console.log(ctx.lineWidth);
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
    context.lineWidth = pixel;
    setCtx(context);
  }

  /**
   * 선의 색상을 지정하는 함수입니다.
   * hex코드 또는 rgb(x, x, x)의 형태의 파라미터를 받습니다.
   * @param {string} c
   */
  function setColor(c) {
    const context = canvasRef.current.getContext('2d');
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
    context.strokeStyle += op;
    const rgb = context.strokeStyle.replace(/[^%,.\d]/g, '').split(',');
    rgb.pop();
    const hex = rgbToHex(rgb[0] * 1, rgb[1] * 1, rgb[2] * 1);
    context.strokeStyle = hex + op;
    setCtx(context);
  }

  /**
   * 해당 영역을 주어진 색으로 가득 채우는 함수입니다.
   * @param {event} param0
   */
  function fill({ nativeEvent }) {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;

    const context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 10;

    setCtx(context);
  }, []);

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        onClick={(event) => {
          drawCircle(event);
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
      <BtnWrapper>
        {thickness.map((v) => {
          return (
            <ThicknessBtn
              key={v}
              style={{ padding: `${v}px` }}
              onClick={() => {
                setThickness(v * 2);
                setEventState('drawing');
              }}
            />
          );
        })}
      </BtnWrapper>
      <BtnWrapper>
        {color.map((v) => {
          return (
            <ColorBtn
              key={v}
              style={{ backgroundColor: v }}
              onClick={() => {
                setColor(v);
                setEventState('drawing');
              }}
            />
          );
        })}
      </BtnWrapper>
      <BtnWrapper>
        {opacity.map((v) => {
          return (
            <OpacityBtn
              key={v}
              style={{ backgroundColor: `#000000${v}` }}
              onClick={() => setOpacity(v)}
            />
          );
        })}
      </BtnWrapper>
      <button type="button" onClick={() => setEventState('fill')}>
        페인트
      </button>
      <button type="button" onClick={() => undo()}>
        undo
      </button>
      <button type="button" onClick={() => redo()}>
        redo
      </button>
    </Wrapper>
  );
}

const BtnWrapper = styled.div`
  border: 2px solid black;
  border-radius: 8px;
  display: inline-block;
  padding: 5px;
`;

const OpacityBtn = styled.button`
  padding: 10px;
  margin-right: 5px;
  box-sizing: content-box;
  border: none !important;
  background-color: black;
  border-radius: 50%;
`;

const ColorBtn = styled.button`
  padding: 10px;
  margin-right: 5px;
  box-sizing: content-box;
  border: none !important;
  background-color: black;
  border-radius: 50%;
`;

const ThicknessBtn = styled.button`
  margin-right: 5px;
  box-sizing: content-box;
  border: none !important;
  background-color: black;
  border-radius: 50%;
  /* width: 10px;
  height: 10px;
  min-width: 0;
  min-height: 0; */
`;

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Canvas = styled.canvas`
  border: 2px solid black;
  border-radius: 18px;
`;

export default Paint;
