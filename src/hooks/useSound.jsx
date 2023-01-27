import { useEffect } from 'react';
import { Howl } from 'howler';

function useSound(src, volume = 1, fadeoutTime = 0) {
  let sound;
  const soundStop = () => sound.stop();
  const soundPlay = (src) => {
    sound = new Howl({ src });
    sound.volume(volume);
    sound.play();
  };

  useEffect(() => {
    soundPlay(src);
    sound.on('play', () => {
      const fadeouttime = fadeoutTime;
      setTimeout(
        () => sound.fade(volume, 0, fadeouttime),
        (sound.duration() - sound.seek()) * 1000 - fadeouttime,
      );
    });
    return soundStop;
  }, []);
}

export default useSound;
