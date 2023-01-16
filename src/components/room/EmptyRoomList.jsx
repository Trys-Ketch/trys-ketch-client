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
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;
  height: 520px;
`;

const Typography = styled.h3`
  font-family: 'TTTogether';
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: rgba(78, 71, 63, 0.2);
`;

export default EmptyRoomList;
