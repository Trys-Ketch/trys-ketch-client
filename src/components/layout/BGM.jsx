import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import bgm from '../../assets/sound/main-bgm.mp3';
import turnOnSound from '../../utils/turnOnSound';

function BGM() {
  const sound = turnOnSound(bgm, { autoplay: true, loop: true }, 0.3);

  useEffect(() => {
    sound.play();
    return () => {
      sound.stop();
    };
  }, []);

  return <Outlet />;
}

export default BGM;
