import React from 'react';
import styled from 'styled-components';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

function Guessing() {
  return (
    <>
      <h3 style={{ fontSize: '36px', textAlign: 'center' }}>정답을 작성해주세요!</h3>
      <Image src="/img/sanic.webp" alt="sanic" />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '20px',
          transform: 'translate(-50%, 0)',
          width: '70%',
        }}
      >
        <TextInput type="text" width="80%" value="싸닉" />
        <Button style={{ marginLeft: '15px' }}>완료</Button>
      </div>
    </>
  );
}

const Image = styled.img`
  height: 80%;
  display: block;
  margin: 0 auto;
  aspect-ratio: auto 1/1;
`;

export default Guessing;
