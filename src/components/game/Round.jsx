import React from 'react';
import styled from 'styled-components';

function Round({ round }) {
  return <NowRound>{round}</NowRound>;
}

const NowRound = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

export default React.memo(Round);
