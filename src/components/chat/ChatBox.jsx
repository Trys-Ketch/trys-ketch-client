import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextInput from '../common/TextInput';
import FlatButton from '../common/FlatButton';
import MessageList from './MessageList';
import types from '../../utils/types';

function ChatBox() {
  const client = useSelector((state) => state.ingame.stomp);
  const { profileImage, userId, nickname } = useSelector((state) => state.user);
  const { id } = useParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const CHAT_SERVER_URL = `/topic/chat/room/${id}`;

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const chatSubscribe = () => {
    client.subscribe(CHAT_SERVER_URL, (message) => {
      const data = JSON.parse(message.body);
      setMessages((messages) => [...messages, data]);
    });
  };

  const chatPublish = (type, content) => {
    client.publish({
      destination: CHAT_SERVER_URL,
      body: JSON.stringify({
        type,
        userId,
        profileImage,
        nickname,
        content,
      }),
    });
  };

  const chatServerEvents = () => {
    client.onConnect = () => {
      chatSubscribe();
      chatPublish(types.chat.enter, `${nickname}님이 입장하셨습니다.`);
    };
    client.onDisconnect = (frame) => {
      console.log(frame);
      console.log('onDisconnect');
      chatPublish(types.chat.leave, `${nickname}님이 퇴장하셨습니다.`);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    chatPublish(types.chat.chat, input.trim());
    setInput('');
  };

  useEffect(() => {
    chatServerEvents();
  }, [client]);

  return (
    <StChatBox>
      <MessageList messages={messages} />
      <MessageForm>
        <TextInput placeholder="채팅을 입력하세요" value={input} onChange={handleInput} />
        <FlatButton size="small" onClick={handleSubmit}>
          전송
        </FlatButton>
      </MessageForm>
    </StChatBox>
  );
}

const StChatBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 300px;
  height: 40%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: row;
  margin-top: 10px;

  input {
    margin-right: 10px;
  }
`;

export default ChatBox;
