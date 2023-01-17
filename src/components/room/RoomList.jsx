import React from 'react';
import styled from 'styled-components';
import Room from './Room';

function RoomList({ rooms }) {
  return (
    <StContainer>
      {rooms.map((room) => (
        <Room
          randomCode={room.randomCode}
          key={room.id}
          id={room.id}
          title={room.title}
          isPlaying={room.isPlaying}
          cur={room.gameRoomUserCount}
          max={8}
          host={room.hostNick}
        />
      ))}
    </StContainer>
  );
}

const StContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 80px);
  gap: 12px 12px;
  width: 100%;
  margin-bottom: 10px;
`;

export default RoomList;
