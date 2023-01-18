import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar';

function Message({ message }) {
  const { userId } = useSelector((state) => state.user);

  switch (message.type) {
    case 'NOTICE':
      return (
        <Notice>
          <Body>
            <Content>{message.content}</Content>
          </Body>
        </Notice>
      );
    case 'CHAT':
      if (message.userId === userId) {
        return (
          <MyChat>
            <Body>
              <Content>{message.content}</Content>
            </Body>
            <Avatar src={message.profileImage} width="38px" height="38px" />
          </MyChat>
        );
      }
      return (
        <OtherChat>
          <Avatar src={message.profileImage} width="38px" height="38px" />
          <Body>
            <Nickname>{message.nickname}</Nickname>
            <Content>{message.content}</Content>
          </Body>
        </OtherChat>
      );
    default:
      break;
  }
}

const StMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 10px 0;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 5px;
`;

const Nickname = styled.span`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Content = styled.span`
  border-radius: 10px;
  padding: 12px;
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Notice = styled(StMessage)`
  justify-content: center;

  ${Content} {
    color: ${({ theme }) => theme.colors.WHITE};
    background-color: #48afe9;
  }
`;

const MyChat = styled(StMessage)`
  justify-content: flex-end;

  ${Content} {
    background-color: ${({ theme }) => theme.colors.WHITE};
  }
`;

const OtherChat = styled(StMessage)`
  justify-content: flex-start;

  ${Content} {
    width: fit-content;
    margin-top: 5px;
    background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  }
`;

export default Message;
