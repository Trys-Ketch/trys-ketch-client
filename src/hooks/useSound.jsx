import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import turnOnSound from '../utils/turnOnSound';

const useSound = (src) => {
  const soundRef = useRef(null);
  const volume = useSelector((state) => state.sound.volume);

  useEffect(() => {
    soundRef.current = turnOnSound(src);
  }, [src]);

  useEffect(() => {
    soundRef.current.volume(volume);
  }, [volume]);

  return soundRef;
};

export default useSound;
