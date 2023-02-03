import { nanoid } from 'nanoid';
import React from 'react';
import styled from 'styled-components';
import lock from '../../assets/icons/lock-icon.svg';

function MyImageLock() {
  return (
    <Lock>
      <ImageWrapper>
        {[...Array(parseInt(9, 10))].map(() => (
          <Canvas key={nanoid()} />
        ))}
      </ImageWrapper>
      <Description>
        <img src={lock} alt="lock" />
        <DescriptionText>회원만 이용할 수 있는 페이지입니다</DescriptionText>
      </Description>
    </Lock>
  );
}

const Lock = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
  padding-right: 15px;
  ${({ theme }) => theme.common.scroll};
  filter: blur(6px);
`;

const Canvas = styled.div`
  background-color: ${({ theme }) => theme.colors.WHITE};
  box-shadow: 0px 3.5px 3.5px rgba(0, 0, 0, 0.25);
`;

const Description = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-top: 10px;
`;

export default MyImageLock;
