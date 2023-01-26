import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setForceSubmit } from '../app/slices/ingameSlice';

let startTime;
let timerID;

function useTimer(pathRef, center, circleRadius, strokeWidth, timeLimit) {
  const [degree, setDegree] = useState(1);
  const dispatch = useDispatch();

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      end.x,
      end.y,
      'L',
      x,
      y,
    ].join(' ');

    return d;
  }

  function getTimerRadius() {
    timerID = setInterval(() => {
      const nowTime = new Date().getTime();
      setDegree(1 - (nowTime - startTime) / timeLimit);
      if (nowTime - startTime >= timeLimit) {
        console.log('set force submit');
        setDegree(0);
        clearInterval(timerID);
        dispatch(setForceSubmit(true));
      }
    }, 50);
  }

  useEffect(() => {
    pathRef.current.setAttribute(
      'd',
      describeArc(
        center - strokeWidth,
        center - strokeWidth,
        circleRadius - strokeWidth * 2,
        0,
        360 * degree,
      ),
    );
  }, [degree]);

  useEffect(() => {
    startTime = new Date().getTime();
    getTimerRadius();
    return () => {
      clearInterval(timerID);
    };
  }, []);
}

export default useTimer;
