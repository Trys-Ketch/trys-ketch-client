import { useEffect } from 'react';

function useCtx(
  canvasRef,
  setCtx,
  isDrawingState,
  thickness,
  currentColor,
  history,
  historyPointer,
  setEventState,
  setDisplayThicknessBtn,
  setNowThickness,
  setSelectedColorIndex,
  color,
) {
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
}

export default useCtx;
