import { useRef, useEffect } from 'react';

const MINIMUM_AUDIO_LEVEL = 0.001;
const VOLUME_DETECT_INTERVAL = 1000;

function useObserveSpeaking(pc, setIsSpeaking) {
  const interval = useRef(null);
  useEffect(() => {
    if (pc) {
      interval.current = setInterval(() => {
        console.log(pc.getReceivers());
        const receiver = pc.getReceivers().find((r) => {
          return r.track.kind === 'audio';
        });
        const source = receiver?.getSynchronizationSources()[0];
        if (source?.audioLevel && source?.audioLevel > MINIMUM_AUDIO_LEVEL) {
          setIsSpeaking(true);
        } else {
          setIsSpeaking(false);
        }
      }, VOLUME_DETECT_INTERVAL);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [pc]);
}

export default useObserveSpeaking;
