import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avatar';

function Attendee({ user }) {
  return (
    <StUserCard>
      <UserInfo>
        <Avatar width="35px" height="35px" />
        <Nickname>{user.nickname}</Nickname>
      </UserInfo>
    </StUserCard>
  );
}

const StUserCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 10px;

  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
`;

const Nickname = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export default Attendee;
