import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import mic from '../../assets/icons/mic-icon.svg';
import micMute from '../../assets/icons/mic-mute-icon.svg';

import { setMute } from '../../app/slices/muteSlice';

function MuteButton({ socketID, isMuted }) {
  const dispatch = useDispatch();
  function onChangeMute() {
    dispatch(setMute({ socketID, isMuted: !isMuted }));
  }
  return isMuted ? (
    <Button onClick={() => onChangeMute()}>
      <Image src={micMute} alt="muted" />
    </Button>
  ) : (
    <Button onClick={() => onChangeMute()}>
      <Image style={{ marginRight: '2px' }} src={mic} alt="mic" />
    </Button>
  );
}

const Button = styled.button`
  margin: auto 0;
  margin-left: auto;
  cursor: pointer;
`;

const Image = styled.img`
  height: 15px;
  aspect-ratio: auto 1/1;
`;

export default MuteButton;
