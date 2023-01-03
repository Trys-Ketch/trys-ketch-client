import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

function App() {
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
  const opacity = ['1A', '33', '4D', '66', '80', '99', 'B3', 'CC', 'E6', 'FF'];
  // const opacity = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

  const canvasRef = useRef(null);
  // const contextRef = useRef(null);

  const [ctx, setCtx] = useState();
  const [isDrawing, setIsDrawing] = useState();

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

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

  const hexToRgb = (hex) =>
    hex
      .replace(/^#?([A-F\d])([A-F\d])([A-F\d])$/i, (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));

  const rgbToHex = (r, g, b) =>
    `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('')}`;

  function setThickness(pixel) {
    const context = canvasRef.current.getContext('2d');
    context.lineWidth = pixel;
    setCtx(context);
  }

  function setColor(c) {
    const context = canvasRef.current.getContext('2d');
    context.strokeStyle = c;
    setCtx(context);
  }

  function setOpacity(op) {
    const context = canvasRef.current.getContext('2d');
    context.strokeStyle += op;
    const rgb = context.strokeStyle.replace(/[^%,.\d]/g, '').split(',');
    rgb.pop();
    const hex = rgbToHex(rgb[0] * 1, rgb[1] * 1, rgb[2] * 1);
    context.strokeStyle = hex + op;
    setCtx(context);
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
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={(event) => drawing(event)}
        onMouseLeave={finishDrawing}
      />
      <BtnWrapper>
        {thickness.map((v) => {
          return (
            <ThicknessBtn
              key={v}
              style={{ padding: `${v}px` }}
              onClick={() => setThickness(v * 2)}
            />
          );
        })}
      </BtnWrapper>
      <BtnWrapper>
        {color.map((v) => {
          return <ColorBtn key={v} style={{ backgroundColor: v }} onClick={() => setColor(v)} />;
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

export default App;
