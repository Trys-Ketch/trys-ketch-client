import React from 'react';
import styled from 'styled-components';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

function MakeSentence({ submitKeyword, keyword, setKeyword }) {
  function onKeywordChangeHandler(event) {
    setKeyword(event.target.value);
  }
  return (
    <div>
      <p style={{ position: 'absolute', left: '5%', top: '5%', fontSize: '35px' }}>1/1</p>
      <div
        style={{
          padding: '13px 0',
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '50px',
          height: '50px',
          border: '2px solid black',
          borderRadius: '50%',
        }}
      >
        <p
          style={{
            textAlign: 'center',
          }}
        >
          timer
        </p>
      </div>
      <Image>
        <Text>대충 이거 로고임</Text>
      </Image>
      <Image style={{ marginTop: '5%' }}>
        <Text>대충 이거 이미지임</Text>
      </Image>
      <div style={{ fontSize: '28px', textAlign: 'center', marginTop: '5%' }}>문장 쓰기</div>
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
          onChange={(event) => onKeywordChangeHandler(event)}
          value={keyword}
          type="text"
          width="80%"
        />
        <Button onClick={submitKeyword} style={{ marginLeft: '15px' }}>
          완료
        </Button>
      </div>
    </div>
  );
}

const Text = styled.p`
  ${({ theme }) => theme.common.absoluteCenter};
`;

const Image = styled.div`
  position: relative;
  margin: 0 auto;
  width: 150px;
  height: 150px;
  border: 2px solid black;
  border-radius: 50%;
`;

export default MakeSentence;
