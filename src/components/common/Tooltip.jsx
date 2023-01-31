import React from 'react';
import styled, { keyframes } from 'styled-components';

const tooltip = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1;}
`;

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  &:hover > .tooltip,
  &:active > .tooltip {
    display: block;
    animation: ${tooltip} 0.25s linear;
  }
`;

const Content = styled.div`
  display: none;
  position: absolute;
  z-index: 800;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  background-color: #707070;
  color: white;
  border-radius: 3px;
  padding: 3px;
`;

function Tooltip({ children, message }) {
  return (
    <Container>
      {children}
      <Content className="tooltip">{message}</Content>
    </Container>
  );
}

export default Tooltip;
