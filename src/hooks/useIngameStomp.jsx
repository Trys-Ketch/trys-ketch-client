import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { store } from '../app/configStore';
import { closeStomp } from '../app/slices/ingameSlice';
import nonsubmit from '../assets/images/non_submit.png';
import { toast } from '../components/toast/ToastProvider';

let token;

function useIngameStomp(
  ingameStompClient,
  socketID,
  id,
  setKeyword,
  setCompleteKeywordSubmit,
  setCompleteImageSubmit,
  setImage,
  setIsSubmitted,
  setSubmitNum,
) {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subArray = useRef([]).current;
  const keywordIndex = useRef();

  const [round, setRound] = useState(1);
  const [maxSubmitNum, setMaxSubmitNum] = useState(0);
  const [timeLimit, setTimeLimit] = useState(60000);
  const [result, setResult] = useState(false);

  useEffect(() => {
    const { member } = store.getState().login;
    if (member === 'guest') {
      token = cookies.guest;
    } else {
      token = cookies.access_token;
    }

    subArray.push(
      // 서버에서 랜덤 키워드를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/ingame-data/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
        setTimeLimit(data.timeLimit);
      }),
    );
    subArray.push(
      // 모든 플레이어가 키워드 제출을 완료했을 때 gameState를 drawing으로 바꿉니다.
      ingameStompClient.subscribe(`/topic/game/submit-word/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteKeywordSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      // 모든 플레이어가 그림 제출을 완료했을 때 gameState를 guessing으로 바꿉니다.
      ingameStompClient.subscribe(`/topic/game/submit-image/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteImageSubmit(data.completeSubmit);
      }),
    );
    subArray.push(
      // game state가 drawing이 됐을 때 다른 플레이어가 작성한 키워드를 받아오고 round를 증가시킵니다.
      ingameStompClient.subscribe(`/queue/game/before-word/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.keyword === 'null') setKeyword('미제출');
        else setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
        setRound((prev) => prev + 1);
      }),
    );
    subArray.push(
      // game state가 guessing이 됐을 때 다른 플레이어가 그린 이미지를 받아오고 round를 증가시킵니다.
      ingameStompClient.subscribe(`/queue/game/before-image/${socketID}`, (message) => {
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
          ingameStompClient.deactivate();
          dispatch(closeStomp());
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

    // ingame페이지에 처음 들어왔을 때 게임 진행에 필요한 정보를 서버에 요청합니다.
    ingameStompClient.publish({
      destination: '/app/game/ingame-data',
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

  return { keywordIndex, round, maxSubmitNum, timeLimit, result };
}

export default useIngameStomp;
