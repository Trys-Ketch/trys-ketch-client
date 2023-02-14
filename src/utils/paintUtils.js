import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';
import floodFill from './floodFill';
import { EVENT_STATE } from '../helper/constants';

const startDrawing = (setIsDrawing) => {
  setIsDrawing(true);
};

const finishDrawing = (setIsDrawing) => {
  setIsDrawing(false);
};

/**
 * 선을 그리는 함수입니다.
 * @param {event} param0
 */
const drawing = (ctx, isDrawing, { nativeEvent }) => {
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
const drawCircle = (ctx, { nativeEvent }) => {
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
function setThickness(pixel, canvasRef, setCtx, eventState) {
  const context = canvasRef.current.getContext('2d');
  if (eventState !== EVENT_STATE.ERASEING) context.globalCompositeOperation = 'source-over';
  context.lineWidth = pixel;
  setCtx(context);
  GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.Thickness);
}

/**
 * 선의 색상을 지정하는 함수입니다.
 * hex코드 또는 rgb(x, x, x)의 형태의 파라미터를 받습니다.
 * @param {string} c
 */
function setColor(c, canvasRef, setCtx) {
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
function setOpacity(op, canvasRef, setCtx) {
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
function setEraser(canvasRef, setEventState, setCtx) {
  const context = canvasRef.current.getContext('2d');
  context.globalCompositeOperation = 'destination-out';
  context.strokeStyle = 0;
  setEventState(EVENT_STATE.ERASEING);
  setCtx(context);
  GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.erase);
}

/**
 * event state를 drawing으로 바꿔 그림을 그릴 수 있게 하는 함수입니다.
 */
function setDrawing(canvasRef, currentColor, setEventState, setCtx) {
  const context = canvasRef.current.getContext('2d');
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = currentColor;
  setEventState(EVENT_STATE.DRAWING);
  setCtx(context);
  GAEventTrack(GAEventTypes.Category.paintTool, GAEventTypes.Action.paintTool.pencil);
}

/**
 * 해당 영역을 주어진 색으로 가득 채우는 함수입니다.
 * @param {event} param0
 */
function fill(canvasRef, setCtx, ctx, { nativeEvent }) {
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
function undo(historyPointer, history, ctx) {
  if (historyPointer.current === 0) return;
  if (historyPointer.current === history.length)
    history.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
  historyPointer.current -= 1;
  const img = history[historyPointer.current];
  ctx.putImageData(img, 0, 0);
}

/**
 * undo한 그림판을 다시 되돌리는 함수입니다.
 */
function redo(historyPointer, history, ctx) {
  if (historyPointer.current >= history.length - 1) return;
  historyPointer.current += 1;
  const img = history[historyPointer.current];
  ctx.putImageData(img, 0, 0);
}

export {
  startDrawing,
  finishDrawing,
  drawing,
  drawCircle,
  hexToRgb,
  rgbToHex,
  setThickness,
  setColor,
  setOpacity,
  setEraser,
  setDrawing,
  fill,
  undo,
  redo,
};
