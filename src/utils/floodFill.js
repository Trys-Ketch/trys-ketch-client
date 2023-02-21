export default function floodFill(ctx, x, y, fillColor) {
  /* eslint-disable */
  // 비트연산자, continue, prefix와 같은 기능을 eslint가 못하게 막아버려서 해당 페이지에서는 해제했습니다.

  const TOLERANCE = 50;

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  function getPixelColor(img, x, y) {
    return img[y * w + x];
  }

  const stack = [x, y];
  let stPtr = 2;
  const dx = [0, -1, +1, 0];
  const dy = [-1, 0, 0, +1];

  const imageData = ctx.getImageData(0, 0, w, h);
  const imgData = new Uint32Array(imageData.data.buffer);

  // floodfill을 시작할 fixel의 color
  const hitColor = getPixelColor(imgData, x, y);

  // 해당 fixel이 이전에 색칠되지 않았으면 색상값은 white(0xffffffff)가 아니라 0입니다.
  // 따라서 색상값이 0인 경우는 white로 취급하여 처리했습니다.
  const hitHex = hitColor === 0 ? 0xffffffff : hitColor;

  // 최대 수백만 픽셀에 색상을 적용해야하기 때문에 퍼포먼스를 위해 비트 연산자를 사용했습니다.
  // 비트 연산자만큼 빠른게 없더군요
  const hitA = hitHex & 0xff000000;
  const hitG = hitHex & 0x00ff0000;
  const hitB = hitHex & 0x0000ff00;
  const hitR = hitHex & 0x000000ff;

  while (stPtr) {
    const curPointY = stack[--stPtr];
    const curPointX = stack[--stPtr];

    for (let i = 0; i < 4; i += 1) {
      const nextPointX = curPointX + dx[i];
      const nextPointY = curPointY + dy[i];

      if (nextPointX < 0 || nextPointY < 0 || nextPointX >= w || nextPointY >= h) {
        continue;
      }

      const nPO = nextPointY * w + nextPointX; // nextPointOffset

      const hex = imgData[nPO] === 0 ? 0xffffffff : imgData[nPO];

      // imgData의 값은 0xffffffff와 같은 16진수입니다.
      // 상위 비트부터 ABGR의 값을 나타냅니다.
      // 즉, 0xff(A)ff(B)ff(G)ff(R)을 의미합니다.
      // 따라서 RGBA값에 해당하는 비트를 and연산자로 마스킹해서 오른쪽으로 shift해 RGBA값을 사용했습니다.
      const A = (hitA - (hex & 0xff000000)) >> 24;
      const G = (hitG - (hex & 0x00ff0000)) >> 16;
      const B = (hitB - (hex & 0x0000ff00)) >> 8;
      const R = (hitR - (hex & 0x000000ff)) >> 0;

      if (imgData[nPO] === fillColor) {
        continue;
      }

      if (
        R > -TOLERANCE &&
        R < TOLERANCE &&
        G > -TOLERANCE &&
        G < TOLERANCE &&
        B > -TOLERANCE &&
        B < TOLERANCE &&
        A > -TOLERANCE &&
        A < TOLERANCE
      ) {
        // RGBA값의 표준편차를 구해 if문의 condition으로 사용 할 수도 있지만, 루트 연산이 성능상 좋지 않을 것 같습니다.
        // 따라서 일일이 TOLERANCE값과 비교했습니다.
        imgData[nPO] = fillColor;

        stack[stPtr++] = nextPointX;
        stack[stPtr++] = nextPointY;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
