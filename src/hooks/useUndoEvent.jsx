import { useCallback, useEffect } from 'react';

function useUndoEvent(undo, historyPointer, history, ctx, isDrawingState) {
  useEffect(() => {
    function keyDown(e) {
      const evtobj = window.event ? window.event : e;
      if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
        undo(historyPointer, history, ctx);
      }
    }

    if (isDrawingState) {
      document.addEventListener('keydown', keyDown, false);
    } else document.removeEventListener('keydown', keyDown, false);
    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [isDrawingState, ctx]);
}

export default useUndoEvent;
