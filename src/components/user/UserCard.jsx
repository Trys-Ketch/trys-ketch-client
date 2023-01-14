import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';

function UserCard({ user }) {
  return (
    <StUserCard>
      <Avatar />
      <Nickname>{user.nickname}</Nickname>
    </StUserCard>
  );
}

const StUserCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid;
`;

const Nickname = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export default UserCard;
