function getPixel(imageData, x, y) {
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
    return [-1, -1, -1, -1]; // impossible color
  }
  const offset = (y * imageData.width + x) * 4;
  return imageData.data.slice(offset, offset + 4);
}

function setPixel(imageData, x, y, color) {
  const offset = (y * imageData.width + x) * 4;

  imageData.data[offset + 0] = color[0];
  imageData.data[offset + 1] = color[1];
  imageData.data[offset + 2] = color[2];
  imageData.data[offset + 3] = color[3];
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function fillPixel(imageData, x, y, targetColor, fillColor) {
  const currentColor = getPixel(imageData, x, y);
  if (colorsMatch(currentColor, targetColor)) {
    setPixel(imageData, x, y, fillColor);
    fillPixel(imageData, x + 1, y, targetColor, fillColor);
    fillPixel(imageData, x - 1, y, targetColor, fillColor);
    fillPixel(imageData, x, y + 1, targetColor, fillColor);
    fillPixel(imageData, x, y - 1, targetColor, fillColor);
  }
}

export default function floodFill(ctx, x, y, fillColor) {
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

  // read the pixels in the canvas
  const imageData = ctx.getImageData(0, 0, w, h);
  const imgData = new Uint32Array(imageData.data.buffer);

  // get the color we're filling
  const hitColor = getPixelColor(imgData, x, y);

  // const hitHex = hitColor.toString(16) === '0' ? 'ffffffff' : hitColor.toString(16);

  const hitHex = hitColor === 0 ? 0xffffffff : hitColor;

  // eslint-disable-next-line
  const hitA = hitHex & 0xff000000;
  // eslint-disable-next-line
  const hitG = hitHex & 0x00ff0000;
  // eslint-disable-next-line
  const hitB = hitHex & 0x0000ff00;
  // eslint-disable-next-line
  const hitR = hitHex & 0x000000ff;

  // const hitA = `0x${hitHex.substring(0, 2)}` * 1;
  // const hitG = `0x${hitHex.substring(2, 4)}` * 1;
  // const hitB = `0x${hitHex.substring(4, 6)}` * 1;
  // const hitR = `0x${hitHex.substring(6, 8)}` * 1;

  // const tolerance = (TOLERANCE * TOLERANCE * 4) ** 0.5;

  // check we are actually filling a different color
  while (stPtr) {
    stPtr -= 1;
    const curPointY = stack[stPtr];
    stPtr -= 1;
    const curPointX = stack[stPtr];

    for (let i = 0; i < 4; i += 1) {
      const nextPointX = curPointX + dx[i];
      const nextPointY = curPointY + dy[i];

      if (nextPointX < 0 || nextPointY < 0 || nextPointX >= w || nextPointY >= h) {
        // eslint-disable-next-line
        continue;
      }

      const nPO = nextPointY * w + nextPointX; // nextPointOffset
      // const hex = imgData[nPO].toString(16) === '0' ? 'ffffffff' : imgData[nPO].toString(16);

      const hex = imgData[nPO] === 0 ? 0xffffffff : imgData[nPO];

      // eslint-disable-next-line
      const A = (hitA - (hex & 0xff000000)) >> 24;
      // eslint-disable-next-line
      const G = (hitG - (hex & 0x00ff0000)) >> 16;
      // eslint-disable-next-line
      const B = (hitB - (hex & 0x0000ff00)) >> 8;
      // eslint-disable-next-line
      const R = (hitR - (hex & 0x000000ff)) >> 0;

      // if (!(R === 0) || !(G === 0) || !(B === 0) || !(A === 0)) console.log(R, G, B, A);

      // console.log(hitHex, hex);
      // console.log((R * R + G * G + B * B + A * A) ** 0.5, tolerance);

      if (imgData[nPO] === fillColor) {
        // eslint-disable-next-line
        continue;
      }
      // if (imgData[nPO] === hitColor)
      // if (Math.abs(hitR - R) < 8 && Math.abs(hitG - G) < 8 && Math.abs(hitB - B) < 8)

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
        imgData[nPO] = fillColor;

        stack[stPtr] = nextPointX;
        stPtr += 1;
        stack[stPtr] = nextPointY;
        stPtr += 1;
      }
    }

    // fillPixel(imageData, x, y, targetColor, fillColor);

    // while (stack.length) {
    //   const idx = stack.pop();
    //   setPixel(imageData, idx.x, idx.y, fillColor);

    //   if (colorsMatch(getPixel(imageData, idx.x + 1, idx.y), targetColor)) {
    //     stack.push({ x: idx.x + 1, y: idx.y });
    //   }
    //   if (colorsMatch(getPixel(imageData, idx.x - 1, idx.y), targetColor)) {
    //     stack.push({ x: idx.x - 1, y: idx.y });
    //   }
    //   if (colorsMatch(getPixel(imageData, idx.x, idx.y - 1), targetColor)) {
    //     stack.push({ x: idx.x, y: idx.y - 1 });
    //   }
    //   if (colorsMatch(getPixel(imageData, idx.x, idx.y + 1), targetColor)) {
    //     stack.push({ x: idx.x, y: idx.y + 1 });
    //   }
    // }
    // put the data back
  }
  ctx.putImageData(imageData, 0, 0);
}
