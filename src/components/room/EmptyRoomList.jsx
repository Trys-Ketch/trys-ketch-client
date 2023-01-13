import React from 'react';
import styled from 'styled-components';

function EmptyRoomList() {
  return (
    <Empty>
      <Typography>지금은 방이 없어요.</Typography>
      <Typography>방을 만들고 친구를 초대해보세요!</Typography>
    </Empty>
  );
}

const Empty = styled.div`
  width: 100%;
  height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Typography = styled.h3`
  font-family: 'TTTogether';
  font-weight: 400;
  font-size: 1.5rem;
  color: rgba(78, 71, 63, 0.2);
`;

export default EmptyRoomList;
