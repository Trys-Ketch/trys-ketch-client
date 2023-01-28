import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { nanoid } from 'nanoid';
import { closeStomp } from '../app/slices/ingameSlice';
import Container from '../components/layout/Container';
import { store } from '../app/configStore';
import ResultUserList from '../components/gameResult/ResultUserList';
import GAEventTypes from '../ga/GAEventTypes';
import GAEventTrack from '../ga/GAEventTrack';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import MicButton from '../components/button/MicButton';
import MuteUserList from '../components/mute/MuteUserList';
import { setLocalMute } from '../app/slices/muteSlice';
import { toast } from '../components/toast/ToastProvider';
import arrow from '../assets/icons/right-arrow.svg';
import KeywordResult from '../components/gameResult/KeywordResult';
import ImageResult from '../components/gameResult/ImageResult';

let token;
const subArray = [];
let resultArray;
let userList;

function GameResult() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const localIsMuted = useSelector((state) => state.mute.localMute);

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
    subArray.push(
      // 정해진 인원수보다 게임에 남은 인원이 적어지면 강제로 로비로 리다이렉트합니다.
      ingameStompClient.subscribe(`/topic/game/shutdown/${id}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.shutdown) {
          ingameStompClient.deactivate();
          dispatch(closeStomp());
          navigate(`/room/${id}`, { replace: true });
          toast.error('인원이 모자라 진행이 어렵습니다.');
        }
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
    GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.backToRoom);
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
      navigate(`/room/${id}`, { replace: true });
    }
  }, [isGameEnd]);

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton size="xlarge" />
            <MicButton
              mute={localIsMuted}
              onClick={() => dispatch(setLocalMute(!localIsMuted))}
              size="xlarge"
            />
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
          {isLoading ? null : (
            <FirstKeyword>{resultArray[nowKeywordIndex][0].keyword}</FirstKeyword>
          )}
          {isLoading
            ? null
            : resultArray[nowKeywordIndex].map((result, idx) => {
                if (idx % 2 === 0)
                  return (
                    <KeywordResult
                      key={`keyword-${nanoid()}`}
                      nickname={result.nickname}
                      userImg={result.userImgPath}
                      keyword={result.keyword}
                    />
                  );
                return (
                  <ImageResult
                    key={`image-${result.imgId}`}
                    nickname={result.nickname}
                    imgId={result.imgId}
                    img={result.imgPath}
                    userImg={result.userImgPath}
                  />
                );
              })}
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

const ResultArea = styled.div`
  position: relative;
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
