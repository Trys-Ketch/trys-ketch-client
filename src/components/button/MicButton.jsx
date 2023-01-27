import React, { useState } from 'react';
import mic from '../../assets/icons/mic-icon.svg';
import micMute from '../../assets/icons/mic-mute-icon.svg';
import IconButton from '../common/IconButton';

function MicButton({ size }) {
  const [mute, setMute] = useState(false);

  const handleMute = () => {
    setMute(!mute);
  };

  return (
    <IconButton
      onClick={handleMute}
      size={size}
      icon={mute ? micMute : mic}
      selected={mute}
      text="마이크"
    />
  );
}

export default MicButton;
