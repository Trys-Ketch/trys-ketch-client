import React from 'react';
import styled from 'styled-components';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

function Guessing({ toggleReady, isSubmitted, image, socketID, keyword, setKeyword }) {
  function onKeywordChangeHandler(event) {
    setKeyword(event.target.value);
  }

  return (
    <TempWrapper>
      <h3 style={{ fontSize: '36px', textAlign: 'center' }}>정답을 작성해주세요!</h3>
      <Image src={image} alt={socketID} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '20px',
          transform: 'translate(-50%, 0)',
          width: '70%',
        }}
      >
        <TextInput
          type="text"
          width="80%"
          value={keyword}
          onChange={(event) => onKeywordChangeHandler(event)}
        />
        {/* {isSubmitted ? (
          <Button disabled style={{ marginLeft: '15px' }}>
            취소
          </Button>
        ) : (
          <Button onClick={submitKeyword} style={{ marginLeft: '15px' }}>
            완료
          </Button>
        )} */}
        <Button onClick={toggleReady} style={{ marginLeft: '15px' }}>
          {isSubmitted ? '취소' : '제출'}
        </Button>
      </div>
    </TempWrapper>
  );
}

const TempWrapper = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  width: 600px;
  height: 800px;
`;

const Image = styled.img`
  ${({ theme }) => theme.common.absoluteCenter};
  background-color: white;
  display: block;
  margin: 0 auto;
  width: 80%;
  aspect-ratio: auto 1/1;
`;

export default Guessing;
