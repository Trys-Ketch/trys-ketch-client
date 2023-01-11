import React from 'react';
import styled from 'styled-components';

function Guessing() {
  return (
    <>
      <h3 style={{ fontSize: '36px', textAlign: 'center' }}>정답을 작성해주세요!</h3>
      <Image src="/img/sanic.webp" alt="sanic" />
    </>
  );
}

const Image = styled.img`
  width: 80%;
  height: 80%;
  text-align: center;
`;

export default Guessing;
