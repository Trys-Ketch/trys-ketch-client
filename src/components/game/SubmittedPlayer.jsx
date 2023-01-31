import React from 'react';
import styled from 'styled-components';
import user from '../../assets/icons/user-icon.svg';

function SubmittedPlayer({ submitNum, maxSubmitNum }) {
  return (
    <SubmittedPlayerWrapper>
      <div className="user-icon">
        <img src={user} alt="user" />
      </div>
      <SubmittedPlayerText>
        {submitNum}/{maxSubmitNum}
      </SubmittedPlayerText>
    </SubmittedPlayerWrapper>
  );
}

const SubmittedPlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  width: 100%;
`;

const SubmittedPlayerText = styled.div`
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  font-size: 18px;
  margin-left: 5px;
`;

export default React.memo(SubmittedPlayer);
