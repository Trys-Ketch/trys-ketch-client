import React from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageForm';
import AttendeeList from '../components/game/AttendeeList';

function GameRoom() {
  return (
    <div>
      <AttendeeList />
      <MessageList />
      <MessageInput />
    </div>
  );
}

export default GameRoom;
