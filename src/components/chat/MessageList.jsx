import React from 'react';
import styled from 'styled-components';
import Message from './Message';

function MessageList({ messages }) {
  return (
    <StMessageList>
      {messages.map((message, idx) => (
        <Message key={idx} message={message} />
      ))}
    </StMessageList>
  );
}

const StMessageList = styled.div`
  height: 100%;
  padding: 0 15px 0 0;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.DIM_GRAY};
    border-radius: 6px;
  }
`;

export default MessageList;
