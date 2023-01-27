import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Button from '../components/common/Button';
import { closeStomp } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import { store } from '../app/configStore';
import ResultUserList from '../components/gameResult/ResultUserList';

import arrow from '../assets/icons/right-arrow.svg';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MicButton from '../components/button/MicButton';
import MuteUserList from '../components/mute/MuteUserList';

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
let userList;

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
        userList = data.gamerList;
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
        setNowKeywordIndex(data.keywordIndex);
      }),
    );

    ingameStompClient.publish({
      destination: '/app/game/result',
      body: JSON.stringify({ roomId: id, webSessionId: socketID, token }),
    });

    return () => {
      if (ingameStompClient) {
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
    <>
      <FloatBox
        top={
          <>
            <SettingButton size="xlarge" />
            <MicButton size="xlarge" />
            <MuteUserList socketID={socketID} />
          </>
        }
      />
      <Container
        style={{
          justifyContent: 'space-between',
          padding: '20px',
          height: '680px',
          width: '1200px',
        }}
      >
        {isLoading ? null : <ResultUserList userList={userList} />}
        <ResultArea>
          {isLoading ? null : <FirstKeyword>{resultArray[nowKeywordIndex][0][1]}</FirstKeyword>}
          {isLoading
            ? null
            : resultArray[nowKeywordIndex].map((v, i) => {
                if (i % 2 === 0)
                  return (
                    <div key={`${v[0]}-1`}>
                      <KeywordNickname key={`${v[0]}0`}>{v[0]}</KeywordNickname>
                      <KeywordWrapper key={`${v[0]}1`}>
                        <ProfileImg src={v[2]} alt={`profile_${i}`} />
                        <Keyword key={`${v[0]}2`}>{v[1]}</Keyword>
                      </KeywordWrapper>
                    </div>
                  );
                return (
                  <div key={`${v[0]}4`}>
                    <ImageNickname key={`${v[0]}5`}>{v[0]}</ImageNickname>
                    <ImageContainer key={`${v[0]}6`}>
                      <ImageWrapper key={`${v[0]}7`}>
                        <Image key={`${v[0]}8`} src={v[1]} alt={`img_${i}`} />
                      </ImageWrapper>
                      <ProfileImg src={v[2]} alt={`profile_${i}`} key={`${v[0]}8`} />
                    </ImageContainer>
                  </div>
                );
              })}
          {/* {isHost && !(nowKeywordIndex === 0) && (
          <Button onClick={() => prevKeywordIndex()}>이전</Button>
        )}
        {isHost && !isLast && <Button onClick={() => nextKeywordIndex()}>다음</Button>}
        {isHost && isLast && <Button onClick={() => endGame()}>게임 종료</Button>} */}
          {isHost && (
            <PrevNextButtonWrapper>
              {!(nowKeywordIndex === 0) && (
                <PrevNextButton onClick={() => prevKeywordIndex()} style={{ marginRight: 'auto' }}>
                  <img
                    style={{
                      transform: 'scaleX(-1)',
                      marginRight: '10px',
                    }}
                    src={arrow}
                    alt="prev"
                  />
                  이전
                </PrevNextButton>
              )}
              {!isLast && (
                <PrevNextButton onClick={() => nextKeywordIndex()} style={{ marginLeft: 'auto' }}>
                  다음
                  <ArrowImg
                    style={{
                      marginLeft: '10px',
                    }}
                    src={arrow}
                    alt="next"
                  />
                </PrevNextButton>
              )}
              {isLast && (
                <PrevNextButton onClick={() => endGame()} style={{ marginLeft: 'auto' }}>
                  게임 종료
                  <ArrowImg
                    style={{
                      marginLeft: '10px',
                    }}
                    src={arrow}
                    alt="next"
                  />
                </PrevNextButton>
              )}
            </PrevNextButtonWrapper>
          )}
        </ResultArea>
      </Container>
    </>
  );
}

const ArrowImg = styled.img`
  height: '80%';
  aspect-ratio: 'auto 1/1';
  vertical-align: 'middle';
  margin: 'auto 0';
  margin-left: '10px';
`;

const PrevNextButton = styled.button`
  height: 50px;
  line-height: 50px;
  width: max-content;
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #746b5f;
  cursor: pointer;
`;

const PrevNextButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

const FirstKeyword = styled.div`
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  background-color: ${({ theme }) => theme.colors.DARK_LAVA};
  color: white;
  width: 100%;
  height: 80px;
  line-height: 80px;
  border-radius: 15px;
  text-align: center;
`;

const KeywordWrapper = styled.div`
  margin-top: 10px;
  align-items: center;
  display: flex;
`;

const KeywordNickname = styled.div`
  width: max-content;
  margin-left: 65px;
  margin-top: 18px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const Keyword = styled.pre`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  display: block;
  width: max-content;
  padding: 15px;
  margin-left: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
  line-height: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
`;

const ImageNickname = styled.div`
  margin-right: 65px;
  margin-left: auto;
  width: max-content;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const ImageWrapper = styled.div`
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  padding: 15px;
  width: max-content;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
`;

const Image = styled.img`
  margin-left: auto;
  width: 300px;
  aspect-ratio: auto 1/1;
  background-color: white;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  /* background-color: #1290cb; */
  width: 50px;
  height: 50px;
`;

const ResultArea = styled.div`
  padding: 15px;
  width: 62.2%;
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
