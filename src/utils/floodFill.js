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
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const stack = [];
  stack.push({ x, y });
  // read the pixels in the canvas
  const imageData = ctx.getImageData(0, 0, w, h);

  // get the color we're filling
  const targetColor = getPixel(imageData, x, y);

  // check we are actually filling a different color
  if (!colorsMatch(targetColor, fillColor)) {
    // fillPixel(imageData, x, y, targetColor, fillColor);

    while (stack.length) {
      const idx = stack.pop();
      setPixel(imageData, idx.x, idx.y, fillColor);

      if (colorsMatch(getPixel(imageData, idx.x + 1, idx.y), targetColor)) {
        stack.push({ x: idx.x + 1, y: idx.y });
      }
      if (colorsMatch(getPixel(imageData, idx.x - 1, idx.y), targetColor)) {
        stack.push({ x: idx.x - 1, y: idx.y });
      }
      if (colorsMatch(getPixel(imageData, idx.x, idx.y - 1), targetColor)) {
        stack.push({ x: idx.x, y: idx.y - 1 });
      }
      if (colorsMatch(getPixel(imageData, idx.x, idx.y + 1), targetColor)) {
        stack.push({ x: idx.x, y: idx.y + 1 });
      }
    }
    // put the data back
    ctx.putImageData(imageData, 0, 0);
  }
}
