import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';

function Message({ message }) {
  return (
    <StMessage className={message.type}>
      {message.type === 'my' ? (
        <>
          <Body>
            <Nickname>{message.nickname}</Nickname>
            <Content>{message.content}</Content>
          </Body>
          <Avatar width="32px" height="32px" />
        </>
      ) : (
        <>
          <Avatar width="32px" height="32px" />
          <Body>
            <Nickname>{message.nickname}</Nickname>
            <Content>{message.content}</Content>
          </Body>
        </>
      )}
    </StMessage>
  );
}

const StMessage = styled.div`
  display: flex;
  flex-direction: row;
  &.my {
    justify-content: flex-end;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.span`
  font-weight: 700;
`;

const Content = styled.span``;

export default Message;
