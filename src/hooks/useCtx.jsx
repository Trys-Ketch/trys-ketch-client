import { useEffect, useRef } from 'react';

function useCtx(
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
) {
  const canvasRef = useRef(null);

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

      history.splice(0);
      currentColor.current = 'black';
      historyPointer.current = 0;

      setEventState('drawing');
      setDisplayThicknessBtn(false);
      setNowThickness(2);

      setSelectedColorIndex(color.length - 1);
    }
  }, [isDrawingState]);

  return canvasRef;
}

export default useCtx;
