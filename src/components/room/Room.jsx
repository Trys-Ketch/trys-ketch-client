import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import roomAPI from '../../api/room';
import crown from '../../assets/icons/crown.png';
import person from '../../assets/icons/person-icon.svg';
import { toast } from '../toast/ToastProvider';

function Room({ randomCode, title, isPlaying, cur, max, host }) {
  const navigate = useNavigate();

  const handleEnter = () => {
    roomAPI
      .enterRoom(randomCode)
      .then((res) => {
        if (res.data.statusCode === 200) {
          navigate(`/room/${res.data.data.roomId}`);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <StRoom onClick={handleEnter} disabled={isPlaying || cur === max}>
      <LeftSide>
        <Title>{title}</Title>
      </LeftSide>
      <RightSide>
        <StatusBadge className={isPlaying ? 'game' : 'wait'}>
          {isPlaying ? '진행중' : '대기중'}
        </StatusBadge>
        <img src={person} alt="person" />
        <Quota>{`${cur}/${max}`}</Quota>
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
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  // color: #746B5F, opacity : 0.5
  border-radius: 10px;
  border-bottom: 5px solid rgba(116, 107, 95, 0.5);
  cursor: pointer;
  transition: 0.3s ease;

  &:disabled {
    /* opacity: 0.5; */
    filter: brightness(80%);
  }

  &:hover:not([disabled]) {
    scale: 1.01;
  }
`;

const LeftSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightSide = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  img {
    width: 1rem;
    margin: 0 3px;
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  margin-left: 10px;
`;

const StatusBadge = styled.div`
  padding: 5px;
  white-space: nowrap;
  margin-right: 10px;
  border-radius: 13px;

  &.game {
    background-color: ${({ theme }) => theme.colors.BLUE2};
    color: ${({ theme }) => theme.colors.WHITE};
  }

  &.wait {
    background-color: ${({ theme }) => theme.colors.YELLOW_GREEN};
    color: ${({ theme }) => theme.colors.WHITE};
  }
`;

const Quota = styled.span`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  margin-right: 10px;
`;

const Host = styled.span`
  min-width: 150px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
`;

export default Room;
