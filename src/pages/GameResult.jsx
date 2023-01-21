import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from '../components/common/Button';
import { closeStomp } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';

let token;
const subArray = [];
const resultArray = [
  [
    ['name1-1', 'test1-1'],
    ['name1-2', '/img/sanic.webp'],
    ['name1-3', 'test1-2'],
    ['name1-4', '/img/sanic.webp'],
    ['name1-5', 'test1-3'],
    ['name1-6', '/img/sanic.webp'],
  ],
  [
    ['name2-1', 'test2-1'],
    ['name2-2', '/img/sanic.webp'],
    ['name2-3', 'test2-2'],
    ['name2-4', '/img/sanic.webp'],
    ['name2-5', 'test2-3'],
    ['name2-6', '/img/sanic.webp'],
  ],
  [
    ['name3-1', 'test3-1'],
    ['name3-2', '/img/sanic.webp'],
    ['name3-3', 'test3-2'],
    ['name3-4', '/img/sanic.webp'],
    ['name3-5', 'test3-3'],
    ['name3-6', '/img/sanic.webp'],
  ],
];

function GameResult() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  // const [isLast, setIsLast] = useState(false);
  // const [nowKeywordIndex, setNowKeywordIndex] = useState(0);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (cookies.access_token) token = cookies.access_token;
  //   else if (cookies.guest) token = cookies.guest;
  //   subArray.push(
  //     ingameStompClient.subscribe(`/queue/game/result/${socketID}`, (message) => {
  //       const data = JSON.parse(message.body);
  //       resultArray = data.result;
  //       setIsHost(data.isHost);
  //       setIsLoading(false);
  //     }),
  //   );
  //   subArray.push(
  //     ingameStompClient.subscribe(`/topic/game/end/${id}`, (message) => {
  //       const data = JSON.parse(message.body);
  //       setIsGameEnd(data.end);
  //     }),
  //   );

  //   ingameStompClient.publish({
  //     destination: '/app/game/result',
  //     body: JSON.stringify({ roomId: id, webSessionId: socketID, token }),
  //   });

  //   return () => {
  //     if (ingameStompClient) {
  //       console.log('client unsubscribes');
  //       for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isGameEnd) {
  //     navigate(`/room/${id}`);
  //     ingameStompClient.deactivate();
  //     dispatch(closeStomp());
  //   }
  // }, [isGameEnd]);

  function endGame() {
    ingameStompClient.publish({
      destination: '/app/game/end',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  // function nextKeywordIndex() {
  //   console.log(nowKeywordIndex);
  // }

  return (
    <Container
      style={{ justifyContent: 'space-between', padding: '20px', height: '680px', width: '1200px' }}
    >
      <UserArea>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => {
          return (
            <ResultUser key={v}>
              <ProfileImg />
              <Nickname>{`닉네임 ${v}`}</Nickname>
            </ResultUser>
          );
        })}
      </UserArea>
      <ResultArea>
        {isLoading
          ? null
          : resultArray.map((v) => {
              return v.map((innerV, innerI) => {
                if (innerI % 2 === 0)
                  return (
                    <KeywordWrapper key={`${innerV[0]}0`}>
                      <ProfileImg key={`${innerV[0]}1`} />
                      <Keyword key={`${innerV[0]}2`}>{`닉네임: ${innerV[0]}
키워드: ${innerV[1]}`}</Keyword>
                    </KeywordWrapper>
                  );
                return (
                  <ImageContainer key={`${innerV[0]}3`}>
                    <ImageWrapper key={`${innerV[0]}4`}>
                      <span key={`${innerV[0]}5`} style={{ margintLeft: 'auto' }}>
                        {`닉네임: ${innerV[0]}`}
                      </span>
                      <Image key={`${innerV[0]}6`} src={innerV[1]} alt={`img_${innerI}`} />
                    </ImageWrapper>
                    <ProfileImg key={`${innerV[0]}7`} />
                  </ImageContainer>
                );
              });
            })}
        {
          isHost ? <Button onClick={() => endGame()}>게임 종료</Button> : null
          // <Button onClick={() => nextKeywordIndex()}>다음 </Button>
        }
      </ResultArea>
    </Container>
  );
}

const Nickname = styled.span`
  margin-left: 10px;
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ProfileImg = styled.div`
  border-radius: 50%;
  background-color: #1290cb;
  padding: 25px;
  width: max-content;
  height: max-content;
`;

const KeywordWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const Keyword = styled.pre`
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  display: block;
  width: max-content;
  padding: 10px;
  margin-left: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
  line-height: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
`;

const ImageWrapper = styled.div`
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  padding: 20px;
  width: max-content;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
`;

const Image = styled.img`
  margin-left: auto;
  margin-top: 10px;
  width: 300px;
  aspect-ratio: auto 1/1;
  background-color: white;
`;

const ResultUser = styled.div`
  padding: 8px;
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

const UserArea = styled.div`
  width: 39.2%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ResultArea = styled.div`
  padding: 15px;
  width: 59.2%;
  height: 100%;
  display: block;
  overflow: scroll;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-radius: 10px;
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

export default GameResult;
