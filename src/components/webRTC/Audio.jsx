import React, { useEffect, useRef, useState } from 'react';

function Audio({ stream }) {
  const ref = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    // if (muted) setIsMuted(muted);
  }, [stream]);

  return (
    <audio ref={ref} muted={isMuted} autoPlay>
      <track kind="captions" />
    </audio>
  );
}

export default Audio;
