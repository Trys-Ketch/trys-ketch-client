import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Message from './Message';

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <StMessageList>
      {messages.map((message, idx) => (
        <Message key={idx} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </StMessageList>
  );
}

const StMessageList = styled.div`
  height: 100%;
  padding: 0 15px 0 0;
  ${({ theme }) => theme.common.scroll};
`;

export default MessageList;
