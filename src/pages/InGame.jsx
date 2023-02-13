import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { store } from '../app/configStore';
import MicButton from '../components/button/MicButton';
import SettingButton from '../components/button/SettingButton';
import FloatBox from '../components/layout/FloatBox';
import MuteUserList from '../components/mute/MuteUserList';
import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';
import { setLocalMute } from '../app/slices/muteSlice';
import GameBoard from '../components/game/GameBoard';
import nonsubmit from '../assets/images/non_submit.png';
import { GAME_STATE, SOCKET_PUB_DEST, SOCKET_SUB_DEST, TIME_LIMIT } from '../helper/constants';
import useIngameStomp from '../hooks/useIngameStomp';

let token;

function InGame() {
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const localIsMuted = useSelector((state) => state.mute.localMute);

  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);

  const { id } = useParams();

  const [keyword, setKeyword] = useState('');
  const [image, setImage] = useState('');
  const [gameState, setGameState] = useState(GAME_STATE.KEYWORD);
  const [completeKeywordSubmit, setCompleteKeywordSubmit] = useState(false);
  const [completeImageSubmit, setCompleteImageSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNum, setSubmitNum] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { keywordIndex, round, maxSubmitNum, timeLimit, result } = useIngameStomp(
    ingameStompClient,
    socketID,
    id,
    setKeyword,
    setCompleteKeywordSubmit,
    setCompleteImageSubmit,
    setImage,
    setIsSubmitted,
    setSubmitNum,
  );

  useEffect(() => {
    const { member } = store.getState().login;
    if (member === 'guest') {
      token = cookies.guest;
    } else {
      token = cookies.access_token;
    }

    subArray.push(
      // 서버에서 랜덤 키워드를 받아옵니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.RANDOM_KEYWORD}/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
        setTimeLimit(data.timeLimit);
      }),
    );
    subArray.push(
      // 모든 플레이어가 키워드 제출을 완료했을 때 gameState를 drawing으로 바꿉니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.SUBMIT_WORD}/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteKeywordSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      // 모든 플레이어가 그림 제출을 완료했을 때 gameState를 guessing으로 바꿉니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.SUBMIT_IMAGE}/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteImageSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      // game state가 drawing이 됐을 때 다른 플레이어가 작성한 키워드를 받아오고 round를 증가시킵니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.BEFORE_KEYWORD}/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.keyword === 'null') setKeyword('미제출');
        else setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
        setRound((prev) => prev + 1);
      }),
    );
    subArray.push(
      // game state가 guessing이 됐을 때 다른 플레이어가 그린 이미지를 받아오고 round를 증가시킵니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.BEFORE_IMAGE}/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword('');
        if (data.image === 'null') setImage(nonsubmit);
        else setImage(data.image);
        keywordIndex.current = data.keywordIndex;
        setRound((prev) => prev + 1);
      }),
    );
    subArray.push(
      // 게임이 끝났다는 정보를 서버로부터 받아옵니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.BEFORE_RESULT}/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setResult(data.isResult);
      }),
    );
    subArray.push(
      // submit이 되었는지를 서버로부터 받아옵니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.IS_SUBMITTED}/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setIsSubmitted(data.isSubmitted);
      }),
    );
    subArray.push(
      // 정해진 인원수보다 게임에 남은 인원이 적어지면 강제로 로비로 리다이렉트합니다.
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.SHUTDOWN}/${id}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.shutdown) {
          ingameStompClient.deactivate();
          dispatch(closeStomp());
          navigate(`/room/${id}`, { replace: true });
          toast.error('인원이 모자라 진행이 어렵습니다.');
        }
      }),
    );
    subArray.push(
      // 몇 명이 제출했는지를 서버로부터 받아옵니다
      ingameStompClient.subscribe(`${SOCKET_SUB_DEST.SUBMIT_COUNT}/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setSubmitNum(data.trueCount);
        setMaxSubmitNum(data.maxTrueCount);
      }),
    );

    // ingame페이지에 처음 들어왔을 때 게임 진행에 필요한 정보를 서버에 요청합니다.
    ingameStompClient.publish({
      destination: SOCKET_PUB_DEST.INIT_GAME,
      body: JSON.stringify({ roomId: id * 1, token, webSessionId: socketID }),
    });

    return () => {
      if (ingameStompClient) {
        for (let i = 0; i < subArray.length; i += 1) {
          subArray[i].unsubscribe();
        }
      }
    };
  }, []);

  // 게임이 끝났다면 결과 페이지로 이동합니다.
  useEffect(() => {
    if (result) navigate(`/result/${id}`, { replace: true });
  }, [result]);

  /**
   * canvas 문서 객체를 받아와 서버에 그림을 제출합니다.
   * @param {HTMLCanvasElement} canvas 그림을 그린 canvas 문서객체입니다.
   */
  function submitImg(canvas) {
    ingameStompClient.publish({
      destination: SOCKET_PUB_DEST.SUBMIT_IMAGE,
      body: JSON.stringify({
        image: canvas.toDataURL(),
        token,
        round,
        roomId: id,
        keywordIndex: keywordIndex.current,
        webSessionId: socketID,
      }),
    });
    GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.submitPicture);
  }

  /**
   * 서버에 키워드를 제출합니다.
   */
  function submitKeyword() {
    ingameStompClient.publish({
      destination: SOCKET_PUB_DEST.SUBMIT_WORD,
      body: JSON.stringify({
        keyword,
        keywordIndex: keywordIndex.current,
        round,
        token,
        roomId: id,
        webSessionId: socketID,
      }),
    });
    GAEventTrack(GAEventTypes.Category.game, GAEventTypes.Action.game.submitWord);
  }

  function toggleDrawingReady(canvas, isSubmitted) {
    ingameStompClient.publish({
      destination: SOCKET_PUB_DEST.READY,
      body: JSON.stringify({
        round,
        token,
        roomId: id,
        webSessionId: socketID,
        isSubmitted,
        keywordIndex: keywordIndex.current,
        keyword: null,
        image: canvas.toDataURL(),
      }),
    });
  }

  function toggleKeywordReady(isSubmitted) {
    const sendData = JSON.stringify({
      round,
      token,
      roomId: id,
      webSessionId: socketID,
      isSubmitted,
      keywordIndex: keywordIndex.current,
      keyword,
      image: null,
    });
    ingameStompClient.publish({
      destination: SOCKET_PUB_DEST.READY,
      body: sendData,
    });
  }

  // 모든 사람들이 키워드를 제출했다면 gameState를 drawing으로 바꿉니다.
  useEffect(() => {
    if (completeKeywordSubmit) {
      setGameState(GAME_STATE.DRAWING);
      submitKeyword();
      setCompleteKeywordSubmit(false);
      setIsSubmitted(false);
      setSubmitNum(0);
      setImage('');
    }
  }, [completeKeywordSubmit]);

  // 모든 사람들이 그림을 제출했다면 gameState를 guessing으로 바꿉니다.
  useEffect(() => {
    if (completeImageSubmit) {
      setGameState(GAME_STATE.GUESSING);
      setCompleteImageSubmit(false);
      setIsSubmitted(false);
      setSubmitNum(0);
    }
  }, [completeImageSubmit]);

  return (
    <div>
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
      {
        {
          keyword: (
            <GameBoard
              isKeywordState
              isGuessingState={false}
              isDrawingState={false}
              isPracticeState={false}
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
              timeLimit={timeLimit}
              isSubmitted={isSubmitted}
              toggleReady={(isSubmitted) => toggleKeywordReady(isSubmitted)}
              keyword={keyword}
              setKeyword={setKeyword}
              gameState={gameState}
            />
          ),
          drawing: (
            <GameBoard
              isKeywordState={false}
              isGuessingState={false}
              isDrawingState
              isPracticeState={false}
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
              timeLimit={timeLimit}
              isSubmitted={isSubmitted}
              toggleReady={(canvas, isSubmitted) => toggleDrawingReady(canvas, isSubmitted)}
              keyword={keyword}
              submitImg={(canvas) => submitImg(canvas)}
              completeImageSubmit={completeImageSubmit}
              gameState={gameState}
            />
          ),
          guessing: (
            <GameBoard
              isKeywordState={false}
              isGuessingState
              isDrawingState={false}
              isPracticeState={false}
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
              timeLimit={timeLimit}
              isSubmitted={isSubmitted}
              toggleReady={(isSubmitted) => toggleKeywordReady(isSubmitted)}
              keyword={keyword}
              setKeyword={setKeyword}
              image={image}
              gameState={gameState}
            />
          ),
        }[gameState]
      }
    </div>
  );
}

export default InGame;
