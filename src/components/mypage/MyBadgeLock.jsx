import { nanoid } from 'nanoid';
import React from 'react';
import styled from 'styled-components';
import lock from '../../assets/icons/lock-icon.svg';

function GuestLock() {
  return (
    <Lock>
      <BadgeWrapper>
        <Category>
          <Typography>접속횟수</Typography>
          <BadgeList>
            {[...Array(parseInt(3, 10))].map(() => (
              <Badge key={nanoid()} />
            ))}
          </BadgeList>
        </Category>
        <Category>
          <Typography>플레이횟수</Typography>
          <BadgeList>
            {[...Array(parseInt(3, 10))].map(() => (
              <Badge key={nanoid()} />
            ))}
          </BadgeList>
        </Category>
        <Category>
          <Typography>플레이타임</Typography>
          <BadgeList>
            {[...Array(parseInt(3, 10))].map(() => (
              <Badge key={nanoid()} />
            ))}
          </BadgeList>
        </Category>
      </BadgeWrapper>
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

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  filter: blur(6px);
`;

const Typography = styled.h2`
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  margin-right: 20px;
`;

const Category = styled.div`
  display: flex;
  width: 75%;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const BadgeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Badge = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.WHITE};
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

export default GuestLock;
