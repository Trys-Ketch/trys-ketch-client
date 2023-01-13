import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import roomAPI from '../../api/room';
import crown from '../../assets/icons/crown.png';

function Room({ id, title, status, cur, max, host }) {
  const navigate = useNavigate();

  const handleEnter = () => {
    roomAPI
      .enterRoom(id)
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
    <StRoom onClick={handleEnter} disabled={!status || cur === max}>
      <LeftSide>
        <Title>{title}</Title>
        <StatusBadge className={status ? 'wait' : 'game'}>
          {status ? '대기중' : '진행중'}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff8ed;
  padding: 10px 10px 10px 15px;
  margin-bottom: 10px;
  font-weight: 700;
  // color: #746B5F, opacity : 0.5
  border-radius: 10px;
  border-bottom: 5px solid rgba(116, 107, 95, 0.5);
  cursor: pointer;
  transition: 0.3s ease;

  &:disabled {
    background-color: #d6c6b2;
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
  font-size: 1.2rem;
  color: #4e473f;
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
    background-color: #96d01c;
    color: #ffffff;
  }

  &.wait {
    background-color: #e9e9e9;
    color: #6a6a6a;
  }
`;

const Quota = styled.span`
  color: #4e473f;
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
