import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import bgm from '../../assets/sounds/main-bgm.mp3';
import turnOnSound from '../../utils/turnOnSound';

function BGM() {
  const { volume } = useSelector((state) => state.sound);
  const sound = useRef(null);

  useEffect(() => {
    sound.current = turnOnSound(bgm, { autoplay: true, loop: true }, volume);
    sound.current.play();
    return () => {
      sound.current.stop();
    };
  }, []);

  useEffect(() => {
    if (volume) {
      if (volume === 0) {
        sound.current.stop();
      } else {
        sound.current.volume(volume);
      }
    }
  }, [sound, volume]);

  return <Outlet />;
}

export default BGM;
