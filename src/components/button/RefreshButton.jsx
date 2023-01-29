import React from 'react';
import styled from 'styled-components';
import refresh from '../../assets/icons/refresh-icon.svg';

function RefreshButton({ onClick, ...props }) {
  return (
    <StRefreshButton onClick={onClick} {...props}>
      <img src={refresh} alt="refresh" />
    </StRefreshButton>
  );
}

const StRefreshButton = styled.button`
  transition: 0.15s linear;
  img {
    width: 38px;
  }
  &:active {
    transform: rotate(360deg);
  }
`;

export default RefreshButton;
