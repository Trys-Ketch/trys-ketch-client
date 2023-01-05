import React from 'react';
import RoomList from '../components/game/RoomList';

function Main() {
  const rooms = [
    { id: 1, title: '안녕하세요', cur: 4, max: 8 },
    { id: 2, title: '안녕하세요', cur: 4, max: 8 },
    { id: 3, title: '안녕하세요', cur: 4, max: 8 },
    { id: 4, title: '안녕하세요', cur: 4, max: 8 },
    { id: 5, title: '안녕하세요', cur: 4, max: 8 },
  ];

  return (
    <div>
      <RoomList rooms={rooms} />
    </div>
  );
}

export default Main;
