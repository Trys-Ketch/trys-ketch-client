import React from 'react';
import styled from 'styled-components';

function EmptyResultUser() {
  return (
    <User>
      <ProfileImg />
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

const ProfileImg = styled.div`
  border-radius: 50%;
  background-color: #1290cb;
  padding: 25px;
  width: max-content;
  height: max-content;
`;

export default EmptyResultUser;
