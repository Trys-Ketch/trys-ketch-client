/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  // 첫번째 렌더링 시에는 실행되지 않음
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;
