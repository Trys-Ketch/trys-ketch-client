import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
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
import PrevNextButton from '../components/gameResult/PrevNextButton';
import KeywordImageResult from '../components/gameResult/KeywordImageResult';

let token;
let subArray = [];
let resultArray;
let userList;

function GameResult() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const { member } = useSelector((state) => state.login);
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
    token = '';
    subArray = [];
    resultArray = [];
    userList = [];

    const { member } = store.getState().login;
    if (member === 'guest') {
      token = cookies.guest;
    } else {
      token = cookies.access_token;
    }

    subArray.push(
      // 게임 결과 화면에서 필요한 정보를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/result/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        resultArray = data.result;
        userList = data.gamerList;
        setIsHost(data.isHost);
        setIsLoading(false);
      }),
    );
    subArray.push(
      // 게임이 끝났으면 서버로부터 끝났다는 데이터를 받아옵니다.
      ingameStompClient.subscribe(`/topic/game/end/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setIsGameEnd(data.end);
      }),
    );
    subArray.push(
      // 다음 키워드 인덱스를 가져옵니다.
      ingameStompClient.subscribe(`/topic/game/next-keyword-index/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setNowKeywordIndex(data.keywordIndex);
      }),
    );
    subArray.push(
      // 키워드 인덱스를 이전으로 되돌립니다.
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
        {!isLoading ? <ResultUserList userList={userList} /> : <ResultUserList userList={[]} />}
        <ResultArea>
          {!isLoading && <FirstKeyword>{resultArray[nowKeywordIndex][0].keyword}</FirstKeyword>}
          <KeywordImageResult
            isLoading={isLoading}
            resultArray={resultArray}
            nowKeywordIndex={nowKeywordIndex}
            member={member}
          />
          {isHost && (
            <PrevNextButtonWrapper>
              {!(nowKeywordIndex === 0) && (
                <PrevNextButton isPrev handleChange={() => prevKeywordIndex()} />
              )}
              {!isLast && (
                <PrevNextButton isPrev={false} isNext handleChange={() => nextKeywordIndex()} />
              )}
              {isLast && <PrevNextButton isPrev={false} isLast handleChange={() => endGame()} />}
            </PrevNextButtonWrapper>
          )}
        </ResultArea>
      </Container>
    </>
  );
}

const PrevNextButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  height: max-content;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-radius: 10px;
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
