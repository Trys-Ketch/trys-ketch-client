import React from 'react';
import styled from 'styled-components';

function RoomTitle({ children }) {
  return <Title>{children}</Title>;
}

const Title = styled.div`
  width: 100%;
  height: 150px;
  ${({ theme }) => theme.common.flexCenter};
  background-color: ${({ theme }) => theme.colors.COYOTE_BROWN};
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.WHITE};
  border-radius: 10px;
`;

export default RoomTitle;
