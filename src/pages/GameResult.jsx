import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from '../components/common/Button';
import { closeStomp } from '../app/slices/ingameSlice';

// const arr = ['test1', '/img/sanic.webp', 'test2', '/img/sanic.webp', 'test3', '/img/sanic.webp'];

let token;
const subArray = [];
let resultArray;

function GameResult() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    subArray.push(
      ingameStompClient.subscribe(`/queue/game/result/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        resultArray = data.result;
        setIsHost(data.isHost);
        setIsLoading(false);
      }),
    );
    subArray.push(
      ingameStompClient.subscribe(`/topic/game/end/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setIsGameEnd(data.end);
      }),
    );

    ingameStompClient.publish({
      destination: '/app/game/result',
      body: JSON.stringify({ roomId: id, webSessionId: socketID, token }),
    });

    return () => {
      if (ingameStompClient) {
        console.log('client unsubscribes');
        for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (isGameEnd) {
      navigate(`/room/${id}`);
      ingameStompClient.deactivate();
      dispatch(closeStomp());
    }
  }, [isGameEnd]);

  function endGame() {
    ingameStompClient.publish({
      destination: '/app/game/end',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  return (
    <Wrapper>
      {isLoading
        ? null
        : resultArray.map((v) => {
            return v.map((innerV, innerI) => {
              if (innerI % 2 === 0) return <Keyword>{`${innerV[0]}, ${innerV[1]}`}</Keyword>;

              return (
                <>
                  <span>{innerV[0]}</span>
                  <Image key={innerV} src={innerV[1]} alt={`img_${innerI}`} />
                </>
              );
            });
          })}
      {isHost ? <Button onClick={() => endGame()}>게임 종료</Button> : null}
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
  background-color: white;
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
