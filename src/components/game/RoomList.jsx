import React from 'react';
import { Link } from 'react-router-dom';
import Room from './Room';

const RoomList = ({ rooms }) => {
  return rooms.map((room) => (
    <Link key={room.id} to={`/room/${room.id}`}>
      <Room title={room.title} cur={room.cur} max={room.max} />
    </Link>
  ));
};

export default RoomList;
