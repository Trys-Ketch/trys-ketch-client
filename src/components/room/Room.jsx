import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import roomAPI from '../../api/room';
import crown from '../../assets/icons/crown.png';

function Room({ randomCode, id, title, isPlaying, cur, max, host }) {
  const navigate = useNavigate();

  const handleEnter = () => {
    roomAPI
      .enterRoom(randomCode)
      .then((res) => {
        alert(res.data.message);
        if (res.data.statusCode === 200) {
          navigate(`/room/${id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StRoom onClick={handleEnter} disabled={isPlaying || cur === max}>
      <LeftSide>
        <Title>{title}</Title>
        <StatusBadge className={isPlaying ? 'game' : 'wait'}>
          {isPlaying ? '진행중' : '대기중'}
        </StatusBadge>
        <Quota>{`${cur}/${max}`}</Quota>
      </LeftSide>
      <RightSide>
        <img src={crown} alt="crown" />
        <Host>{host}</Host>
      </RightSide>
    </StRoom>
  );
}

const StRoom = styled.button`
  ${({ theme }) => theme.common.flexBetween};
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 10px 10px 10px 15px;
  margin-bottom: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  // color: #746B5F, opacity : 0.5
  border-radius: 10px;
  border-bottom: 5px solid rgba(116, 107, 95, 0.5);
  cursor: pointer;
  transition: 0.3s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.BONE};
  }

  &:hover:not([disabled]) {
    scale: 1.01;
  }
`;

const LeftSide = styled.div`
  max-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightSide = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 130px;

  img {
    width: 1rem;
    margin: 0 3px;
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
`;

const StatusBadge = styled.div`
  padding: 5px;
  white-space: nowrap;
  margin: 0 4px;
  border-radius: 13px;

  &.game {
    background-color: ${({ theme }) => theme.colors.SHEEN_GREEN};
    color: ${({ theme }) => theme.colors.WHITE};
  }

  &.wait {
    background-color: ${({ theme }) => theme.colors.PLATINUM};
    color: ${({ theme }) => theme.colors.DIM_GRAY2};
  }
`;

const Quota = styled.span`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const Host = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
`;

export default Room;
