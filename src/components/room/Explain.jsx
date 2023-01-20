import React from 'react';
import styled from 'styled-components';

function Explain() {
  return (
    <StExplain>
      <Subtitle>게임 방법</Subtitle>
      <List>
        <li>원하는 제시어를 입력한다</li>
        <li>제시어를 받으면 제시어에 맞게 그림을 그린다</li>
        <li>그림을 받은 경우에는 그림에 맞게 제시어를 입력</li>
        <li>모든 차례가 끝나면 그림과 제시어가 공개된다.</li>
      </List>
    </StExplain>
  );
}

const StExplain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Subtitle = styled.h3`
  width: 100%;
  margin-top: 10px;
  text-align: center;
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const List = styled.ol`
  list-style: none;
  counter-reset: item;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  padding: 10px;
  margin-top: 10px;

  & li {
    counter-increment: item;
    margin-bottom: 5px;
    align-items: start;
    display: grid;
    grid-template-columns: 0 1fr;
    grid-gap: 2rem;
    color: ${({ theme }) => theme.colors.DIM_GRAY};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: 1.5;
  }

  & li:before {
    width: ${({ theme }) => theme.fontSizes.xxl};
    height: ${({ theme }) => theme.fontSizes.xxl};
    margin-right: 10px;
    content: counter(item);
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.DIM_GRAY};
    color: ${({ theme }) => theme.colors.FLORAL_WHITE};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    text-align: center;
    vertical-align: text-top;
    display: inline-block;
  }
`;

export default Explain;
