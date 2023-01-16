import React from 'react';
import styled from 'styled-components';

function FloatBox({ children }) {
  return <Box>{children}</Box>;
}

const Box = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  position: absolute;
  top: 20px;
  left: 20px;

  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

export default FloatBox;
