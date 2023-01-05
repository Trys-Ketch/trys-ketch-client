import React from 'react';
import styled from 'styled-components';

function Room({ title, cur, max }) {
  return (
    <StRoom>
      <Title>{title}</Title>
      <Quota>{`${cur}/${max}`}</Quota>
    </StRoom>
  );
}

const StRoom = styled.div`
  display: flex;
  justify-content: row;
  align-items: center;
  border: 1px solid;
`;

const Title = styled.h3``;

const Quota = styled.span``;

export default Room;
