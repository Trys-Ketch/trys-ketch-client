import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
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
  const [completeSubmit, setCompleteSubmit] = useState(false);
  const keywordIndex = useRef();
  const round = useRef(1);

  useEffect(() => {
    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;
    subArray.push(
      ingameStompClient.subscribe(`/queue/game/keyword/${socketID}`, (message) => {
        const data = JSON.parse(message.body);
        setKeyword(data.keyword);
        keywordIndex.current = data.keywordIndex;
      }),
    );
    subArray.push(
      ingameStompClient.subscribe(`/topic/game/submit-word/${id}`, (message) => {
        const data = JSON.parse(message.body);
        setCompleteSubmit(data.completeSubmit);
        round.current += 1;
      }),
    );

    ingameStompClient.publish({
      destination: '/app/game/random-keyword',
      body: JSON.stringify({ roomId: id * 1, token }),
    });
  }, []);

  useEffect(() => {
    if (completeSubmit) setGameState('drawing');
  }, [completeSubmit]);

  function submitKeyword() {
    ingameStompClient.publish({
      destination: '/app/game/submit-word',
      body: JSON.stringify({
        keyword,
        keywordIndex: keywordIndex.current,
        round: round.current,
        token,
        roomId: id,
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
              <h3 style={{ textAlign: 'center', fontSize: '42px' }}>제시어</h3>
              <Drawing />
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
