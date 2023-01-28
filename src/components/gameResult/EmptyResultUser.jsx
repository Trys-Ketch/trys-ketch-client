import React from 'react';
import styled from 'styled-components';

function EmptyResultUser() {
  return <User />;
}

const User = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  filter: brightness(0.9);
`;

export default EmptyResultUser;
