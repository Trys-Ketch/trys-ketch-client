import React from 'react';
import styled from 'styled-components';
import Message from './Message';

const messages = [
  { id: 1, type: 'others', nickname: '영리한 붉은박쥐', content: '안녕하세요! 어서오세요!' },
  { id: 2, type: 'others', nickname: '김화백', content: '카소형 오셨군요' },
  { id: 3, type: 'my', nickname: '나는야피카소', content: '어이 김화백이 먼저 와계셨구만' },
  { id: 4, type: 'others', nickname: '영리한 붉은박쥐', content: '안녕하세요! 어서오세요!' },
  { id: 5, type: 'others', nickname: '김화백', content: '카소형 오셨군요' },
  { id: 6, type: 'my', nickname: '나는야피카소', content: '어이 김화백이 먼저 와계셨구만' },
  { id: 7, type: 'others', nickname: '영리한 붉은박쥐', content: '안녕하세요! 어서오세요!' },
  { id: 8, type: 'others', nickname: '김화백', content: '카소형 오셨군요' },
  { id: 9, type: 'my', nickname: '나는야피카소', content: '어이 김화백이 먼저 와계셨구만' },
];

function MessageList() {
  return (
    <StMessageList>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </StMessageList>
  );
}

const StMessageList = styled.div`
  height: 100%;
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
