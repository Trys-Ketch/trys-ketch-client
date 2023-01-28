import React, { useState, useEffect, useRef } from 'react';
import SockJs from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextInput from '../common/TextInput';
import FlatButton from '../common/FlatButton';
import MessageList from './MessageList';
import types from '../../utils/types';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function ChatBox() {
  const client = useRef(null);
  const { profileImage, userId, nickname } = useSelector((state) => state.user);
  const { id } = useParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const CHAT_SERVER_URL = `/topic/chat/room/${id}`;

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const subscribe = () => {
    client.current.subscribe(CHAT_SERVER_URL, ({ body }) => {
      setMessages((message) => [...message, JSON.parse(body)]);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!client.current.connected) {
      return;
    }
    if (message === '') {
      toast.error('채팅 내용을 입력해주세요.');
      return;
    }
    client.current.publish({
      destination: CHAT_SERVER_URL,
      body: JSON.stringify({
        type: types.chat.chat,
        userId,
        profileImage,
        nickname,
        content: message,
      }),
    });
    GAEventTrack(GAEventTypes.Category.room, GAEventTypes.Action.room.submitChat);
    setInput('');
  };

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => new SockJs(`${process.env.REACT_APP_API_URL}/ws`),
      connectHeaders: {},
      debug(str) {},
      onConnect: () => {
        subscribe();
        if (nickname) {
          client.current.publish({
            destination: CHAT_SERVER_URL,
            body: JSON.stringify({
              type: types.chat.enter,
              userId,
              profileImage,
              nickname,
              content: `${nickname}님이 게임에 참가하셨습니다.`,
            }),
          });
        }
      },
      onStompError: (frame) => {},
    });
    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <StChatBox>
      <MessageList messages={messages} />
      <MessageForm>
        <TextInput placeholder="채팅을 입력하세요" value={input} onChange={handleInput} />
        <FlatButton size="small" onClick={handleSubmit} style={{ fontSize: '20px' }}>
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
