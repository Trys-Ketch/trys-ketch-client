import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from '../components/common/Button';
import { closeStomp } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import ResultUser from '../components/game/ResultUser';
import { store } from '../app/configStore';

let token;
const subArray = [];
let resultArray;
// [
//   [
//     ['name1-1', 'test1-1'],
//     ['name1-2', '/img/sanic.webp'],
//     ['name1-3', 'test1-2'],
//     ['name1-4', '/img/sanic.webp'],
//     ['name1-5', 'test1-3'],
//     ['name1-6', '/img/sanic.webp'],
//   ],
//   [
//     ['name2-1', 'test2-1'],
//     ['name2-2', '/img/sanic.webp'],
//     ['name2-3', 'test2-2'],
//     ['name2-4', '/img/sanic.webp'],
//     ['name2-5', 'test2-3'],
//     ['name2-6', '/img/sanic.webp'],
//   ],
//   [
//     ['name3-1', 'test3-1'],
//     ['name3-2', '/img/sanic.webp'],
//     ['name3-3', 'test3-2'],
//     ['name3-4', '/img/sanic.webp'],
//     ['name3-5', 'test3-3'],
//     ['name3-6', '/img/sanic.webp'],
//   ],
// ];

function GameResult() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [nowKeywordIndex, setNowKeywordIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const { member } = store.getState().login;
    if (member === 'guest') {
      token = cookies.guest;
    } else {
      token = cookies.access_token;
    }

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
    subArray.push(
      ingameStompClient.subscribe(`/topic/game/next-keyword-index/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setNowKeywordIndex(data.keywordIndex);
      }),
    );
    subArray.push(
      ingameStompClient.subscribe(`/topic/game/prev-keyword-index/${id}`, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);
        setNowKeywordIndex(data.keywordIndex);
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

  function endGame() {
    ingameStompClient.publish({
      destination: '/app/game/end',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  function nextKeywordIndex() {
    ingameStompClient.publish({
      destination: '/app/game/next-keyword-index',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  function prevKeywordIndex() {
    ingameStompClient.publish({
      destination: '/app/game/prev-keyword-index',
      body: JSON.stringify({ roomId: id, token }),
    });
  }

  useEffect(() => {
    if (!isLoading) {
      if (nowKeywordIndex === resultArray.length - 1) setIsLast(true);
      else setIsLast(false);
    }
  }, [nowKeywordIndex, isLoading]);

  useEffect(() => {
    if (isGameEnd) {
      ingameStompClient.deactivate();
      dispatch(closeStomp());
      navigate(`/room/${id}`);
    }
  }, [isGameEnd]);

  return (
    <Container
      style={{ justifyContent: 'space-between', padding: '20px', height: '680px', width: '1200px' }}
    >
      <UserArea>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => {
          return <ResultUser key={v} nickname={`닉네임 ${v}`} />;
        })}
      </UserArea>
      <ResultArea>
        {isLoading
          ? null
          : resultArray[nowKeywordIndex].map((v, i) => {
              if (i % 2 === 0)
                return (
                  <KeywordWrapper key={`${v[0]}0`}>
                    <ProfileImg key={`${v[0]}1`} />
                    <Keyword key={`${v[0]}2`}>{`닉네임: ${v[0]}
키워드: ${v[1]}`}</Keyword>
                  </KeywordWrapper>
                );
              return (
                <ImageContainer key={`${v[0]}3`}>
                  <ImageWrapper key={`${v[0]}4`}>
                    <span key={`${v[0]}5`} style={{ margintLeft: 'auto' }}>
                      {`닉네임: ${v[0]}`}
                    </span>
                    <Image key={`${v[0]}6`} src={v[1]} alt={`img_${i}`} />
                  </ImageWrapper>
                  <ProfileImg key={`${v[0]}7`} />
                </ImageContainer>
              );
            })}
        {isHost && !(nowKeywordIndex === 0) && (
          <Button onClick={() => prevKeywordIndex()}>이전</Button>
        )}
        {isHost && !isLast && <Button onClick={() => nextKeywordIndex()}>다음</Button>}
        {isHost && isLast && <Button onClick={() => endGame()}>게임 종료</Button>}
      </ResultArea>
    </Container>
  );
}

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

const ProfileImg = styled.div`
  border-radius: 50%;
  background-color: #1290cb;
  padding: 25px;
  width: max-content;
  height: max-content;
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
