import React from 'react';
import styled from 'styled-components';
import characters from '../../assets/images/sad-trysketch.svg';

function EmptyMyImage() {
  return (
    <Empty>
      <img src={characters} alt="characters" />
      <Typography>좋아요한 그림이 없어요.</Typography>
      <Typography>마음에 드는 그림을 간직해보세요</Typography>
    </Empty>
  );
}

const Empty = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;
  height: 100%;
`;

const Typography = styled.h3`
  font-family: 'TTTogether';
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: rgba(78, 71, 63, 0.2);
`;

export default EmptyMyImage;
