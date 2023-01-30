import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMuteUsers } from '../../app/slices/muteSlice';

const localAttendee = null;

function Audio({ stream, socketID }) {
  const ref = useRef(null);
  const users = useSelector((state) => state.mute.users);
  const user = users.filter((v) => v.socketID === socketID)[0];
  const dispatch = useDispatch();
  const isMuted = user?.isMuted;

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <audio ref={ref} muted={isMuted} autoPlay>
      <track kind="captions" />
    </audio>
  );
}

export default Audio;
