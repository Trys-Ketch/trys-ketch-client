import React, { useState } from 'react';
import mike from '../../assets/icons/mike-icon.svg';
import mikeMute from '../../assets/icons/mike-mute-icon.svg';
import IconButton from '../common/IconButton';

function MikeButton({ size }) {
  const [mute, setMute] = useState(false);

  const handleMute = () => {
    setMute(!mute);
  };

  return (
    <IconButton
      onClick={handleMute}
      size={size}
      icon={mute ? mikeMute : mike}
      selected={mute}
      text="마이크"
    />
  );
}

export default MikeButton;
