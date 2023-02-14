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
