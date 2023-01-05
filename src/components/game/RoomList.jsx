import React from 'react';
import Room from './Room';

const RoomList = ({ rooms }) => {
  return rooms.map((room) => (
    <Room key={room.id} title={room.title} cur={room.cur} max={room.max} />
  ));
};

export default RoomList;
