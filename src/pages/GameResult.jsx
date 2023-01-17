import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import Button from '../components/common/Button';

const arr = ['test1', '/img/sanic.webp', 'test2', '/img/sanic.webp', 'test3', '/img/sanic.webp'];

function GameResult() {
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  // const client = useRef();

  // function sendMsg() {
  //   client.current.publish({ destination: '/app/game/result' });
  // }

  // useEffect(() => {
  //   client.current = new Stomp.Client({
  //     // brokerURL: process.env.REACT_APP_STOMP_URL,
  //     debug: (str) => {
  //       console.log(str);
  //     },
  //     webSocketFactory: () => new SockJS(`${process.env.REACT_APP_API_URL}/ws`),
  //     // webSocketFactory: () => new WebSocket(`${process.env.REACT_APP_STOMP_URL}`),
  //   });
  //   client.current.onConnect = (frame) => {
  //     client.current.subscribe(`/topic/game/result`, (message) => {
  //       const data = JSON.parse(message.body);
  //       console.log(data);
  //     });
  //   };
  //   client.current.activate();
  // }, []);

  return (
    <Wrapper>
      {arr.map((v, i) => {
        if (i % 2 === 0) return <Keyword>{v}</Keyword>;

        return <Image key={v} src={v} alt={`img_${i}`} />;
      })}
      {/* <Button onClick={() => sendMsg()}>test</Button> */}
    </Wrapper>
  );
}

const Keyword = styled.span`
  display: flex;
  width: min-content;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid black;
  border-radius: 12px;
`;

const Image = styled.img`
  margin-left: auto;
  float: right;
  margin-bottom: 15px;
  width: 300px;
  aspect-ratio: auto 1/1;
`;

const Wrapper = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  display: flex;
  flex-direction: column;
  width: 60%;
  padding: 20px;
  border: 2px solid black;
  border-radius: 16px;
`;

export default GameResult;
