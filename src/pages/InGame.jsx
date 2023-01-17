import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Drawing from '../components/game/Drawing';
import Guessing from '../components/game/Guessing';
import MakeSentence from '../components/game/MakeSentence';

let token;
const subArray = [];

function InGame() {
  const ingameStompClient = useSelector((state) => state.ingame.stomp);
  const socketID = useSelector((state) => state.ingame.id);
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const { id } = useParams();
  const [keyword, setKeyword] = useState('');
  const [gameState, setGameState] = useState('keyword');
  const [completeKeywordSubmit, setCompleteKeywordSubmit] = useState(false);
  const keywordIndex = useRef();
  const round = useRef(1);

  useEffect(() => {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;

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
        round.current += 1;
      }),
    );
    subArray.push(
      // game state가 drawing이 됐을 때 다른 플레이어가 작성한 키워드를 받아옵니다.
      ingameStompClient.subscribe(`/queue/game/before-word/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
      }),
    );

    // ingame페이지에 처음 들어왔을 때 서버에 랜덤 키워드를 요청합니다.
    ingameStompClient.publish({
      destination: '/app/game/random-keyword',
      body: JSON.stringify({ roomId: id * 1, token }),
    });

    return () => {
      if (ingameStompClient) {
        console.log('client unsubscribes');
        for (let i = 0; i < subArray.length; i += 1) subArray[i].unsubscribe();
      }
    };
  }, []);

  // 모든 사람들이 키워드를 제출했다면 gameState를 drawing으로 바꿉니다.
  useEffect(() => {
    if (completeKeywordSubmit) {
      setGameState('drawing');
      setCompleteKeywordSubmit(false);
    }
  }, [completeKeywordSubmit]);

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
        round: round.current,
        roomId: id,
        keywordIndex: keywordIndex.current,
      }),
    });
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
        round: round.current,
        token,
        roomId: id,
        webSessionId: socketID,
      }),
    });
  }

  return (
    <Wrapper>
      {
        {
          keyword: (
            <MakeSentence
              submitKeyword={() => submitKeyword()}
              keyword={keyword}
              setKeyword={setKeyword}
            />
          ),
          drawing: (
            <div>
              <h3 style={{ textAlign: 'center', fontSize: '42px' }}>{keyword}</h3>
              <Drawing submitImg={(canvas) => submitImg(canvas)} />
            </div>
          ),
          guessing: <Guessing />,
        }[gameState]
      }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  width: 65%;
  height: 80%;
  padding: 20px;
  border: 2px solid black;
  border-radius: 16px;
`;

export default InGame;
