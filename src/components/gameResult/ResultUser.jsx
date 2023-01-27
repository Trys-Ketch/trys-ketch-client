import { nanoid } from 'nanoid';
import React from 'react';
import styled from 'styled-components';
import crown from '../../assets/icons/crown.png';

function ResultUser({ user }) {
  return (
    <User>
      <ProfileImg src={user.imgUrl} alt={nanoid()} />
      {user.isHost && (
        <img
          style={{ marginLeft: '10px', width: '20px', height: '20px' }}
          src={crown}
          alt="crown"
        />
      )}
      <Nickname>{user.nickname}</Nickname>
    </User>
  );
}

const User = styled.div`
  padding: 8px;
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

const Nickname = styled.span`
  margin-left: 10px;
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  /* background-color: #1290cb; */
  width: 50px;
  height: 50px;
`;

export default ResultUser;
