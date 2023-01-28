import React from 'react';
import styled from 'styled-components';

function FloatBox({ top, bottom }) {
  return (
    <Box>
      <Top>{top}</Top>
      <Bottom>{bottom}</Bottom>
    </Box>
  );
}

const Box = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  position: absolute;
  height: 90%;
  top: 30px;
  left: 30px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Top = styled.div`
  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

const Bottom = styled.div`
  & > *:not(:first-child) {
    margin-top: 10px;
  }
`;

export default FloatBox;
