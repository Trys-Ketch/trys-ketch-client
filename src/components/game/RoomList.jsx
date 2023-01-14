import React from 'react';
import Room from '../room/Room';

const RoomList = ({ rooms }) => {
  return rooms.map((room) => (
    <Room
      key={room.id}
      id={room.id}
      title={room.title}
      cur={room.gameRoomUserCount}
      max={8}
      host={room.host}
    />
  ));
};

export default RoomList;
