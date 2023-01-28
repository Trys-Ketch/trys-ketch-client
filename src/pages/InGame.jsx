import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { store } from '../app/configStore';
import MicButton from '../components/button/MicButton';
import SettingButton from '../components/button/SettingButton';
import Drawing from '../components/game/Drawing';
import FloatBox from '../components/layout/FloatBox';
import MuteUserList from '../components/mute/MuteUserList';
import { toast } from '../components/toast/ToastProvider';
import GAEventTrack from '../ga/GAEventTrack';
import GAEventTypes from '../ga/GAEventTypes';
import { setLocalMute } from '../app/slices/muteSlice';

let token;
const subArray = [];

function InGame() {
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const localIsMuted = useSelector((state) => state.mute.localMute);

  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);

  const { id } = useParams();

  const [keyword, setKeyword] = useState('');
  const [image, setImage] = useState('');
  const [gameState, setGameState] = useState('keyword');
  const [completeKeywordSubmit, setCompleteKeywordSubmit] = useState(false);
  const [completeImageSubmit, setCompleteImageSubmit] = useState(false);
  const [result, setResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNum, setSubmitNum] = useState(0);
  const [maxSubmitNum, setMaxSubmitNum] = useState(0);

  const keywordIndex = useRef();
  const [round, setRound] = useState(1);

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
      // 서버에서 랜덤 키워드를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/keyword/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
      }),
    );
    subArray.push(
      // 모든 플레이어가 키워드 제출을 완료했을 때 round를 증가시키고 drawing컴포넌트를 보여줍니다.
      ingameStompClient.subscribe(`/topic/game/submit-word/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteKeywordSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      ingameStompClient.subscribe(`/topic/game/submit-image/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteImageSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      // game state가 drawing이 됐을 때 다른 플레이어가 작성한 키워드를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/before-word/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
        setRound((prev) => prev + 1);
      }),
    );
    subArray.push(
      // game state가 guessing이 됐을 때 다른 플레이어가 그린 이미지를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/before-image/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteImageSubmit(true);
        setKeyword('');
        setImage(data.image);
        keywordIndex.current = data.keywordIndex;
        setRound((prev) => prev + 1);
      }),
    );
    subArray.push(
      // 게임이 끝났다는 정보를 서버로부터 받아옵니다.
      ingameStompClient.subscribe(`/topic/game/before-result/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setResult(data.isResult);
      }),
    );
    subArray.push(
      // submit이 되었는지를 서버로부터 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/is-submitted/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setIsSubmitted(data.isSubmitted);
      }),
    );
    subArray.push(
      // 정해진 인원수보다 게임에 남은 인원이 적어지면 강제로 로비로 리다이렉트합니다.
      ingameStompClient.subscribe(`/topic/game/shutdown/${id}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.shutdown) {
          navigate(`/room/${id}`, { replace: true });
          toast.error('인원이 모자라 진행이 어렵습니다.');
        }
      }),
    );
    subArray.push(
      // 몇 명이 제출했는지를 서버로부터 받아옵니다
      ingameStompClient.subscribe(`/topic/game/true-count/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setSubmitNum(data.trueCount);
        setMaxSubmitNum(data.maxTrueCount);
      }),
    );

    // ingame페이지에 처음 들어왔을 때 서버에 랜덤 키워드를 요청합니다.
    ingameStompClient.publish({
      destination: '/app/game/ingame-data',
      body: JSON.stringify({ roomId: id * 1, token }),
    });

    return () => {
      if (ingameStompClient) {
        for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
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
      destination: '/app/game/submit-image',
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
      destination: '/app/game/submit-word',
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
      destination: '/app/game/toggle-ready',
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
      destination: '/app/game/toggle-ready',
      body: sendData,
    });
  }

  // 모든 사람들이 키워드를 제출했다면 gameState를 drawing으로 바꿉니다.
  useEffect(() => {
    if (completeKeywordSubmit) {
      setGameState('drawing');
      submitKeyword();
      setCompleteKeywordSubmit(false);
      setIsSubmitted(false);
      setSubmitNum(0);
    }
  }, [completeKeywordSubmit]);

  // 모든 사람들이 그림을 제출했다면 gameState를 guessing으로 바꿉니다.
  useEffect(() => {
    if (completeImageSubmit) {
      setGameState('guessing');
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
            <Drawing
              isKeywordState
              isGuessingState={false}
              isDrawingState={false}
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
              isSubmitted={isSubmitted}
              toggleReady={(isSubmitted) => toggleKeywordReady(isSubmitted)}
              keyword={keyword}
              setKeyword={setKeyword}
              gameState={gameState}
            />
          ),
          drawing: (
            <Drawing
              isKeywordState={false}
              isGuessingState={false}
              isDrawingState
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
              isSubmitted={isSubmitted}
              toggleReady={(canvas, isSubmitted) => toggleDrawingReady(canvas, isSubmitted)}
              keyword={keyword}
              submitImg={(canvas) => submitImg(canvas)}
              completeImageSubmit={completeImageSubmit}
              gameState={gameState}
            />
          ),
          guessing: (
            <Drawing
              isKeywordState={false}
              isGuessingState
              isDrawingState={false}
              submitNum={submitNum}
              maxSubmitNum={maxSubmitNum}
              round={round}
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
