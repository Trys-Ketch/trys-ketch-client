import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setForceSubmit } from '../app/slices/ingameSlice';
import alarm from '../assets/sounds/alarm_sound.wav';
import useSound from './useSound';

let startTime;
let timerID;

// 2초 간격으로 세번
const ALARM_TIME = 6 * 1000;

function useTimer(center, circleRadius, strokeWidth, timeLimit, gameState) {
  const pathRef = useRef(null);
  const [degree, setDegree] = useState(1);
  const dispatch = useDispatch();

  const alarmRef = useSound(alarm);

  function alarmSoundOn() {
    return setTimeout(() => {
      alarmRef.current.play();
    }, timeLimit - ALARM_TIME);
  }

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
      if (timerID) clearInterval(timerID);
    };
  }, [gameState, timeLimit]);

  useEffect(() => {
    const alarmTimeoutID = alarmSoundOn();
    return () => {
      clearTimeout(alarmTimeoutID);
    };
  }, [gameState]);

  return pathRef;
}

export default useTimer;
