import { Howl } from 'howler';

function turnOnSound(src, options, volume = 1) {
  let sound;
  const soundInject = (src) => {
    sound = new Howl({ src, ...options });
    sound.volume(volume);
  };
  soundInject(src);
  return sound;
}

export default turnOnSound;
