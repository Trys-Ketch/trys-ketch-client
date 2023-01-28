import React from 'react';
import styled from 'styled-components';
import head from '../../assets/icons/user-head-icon.svg';
import body from '../../assets/icons/user-body-icon.svg';

function SubmittedPlayer({ submitNum, maxSubmitNum }) {
  return (
    <SubmittedPlayerWrapper>
      <UserIcon>
        <img style={{ margin: '0 auto', width: '13px', height: '12px' }} src={head} alt="head" />
        <img style={{ marginTop: '1px', width: '23px', height: '16px' }} src={body} alt="body" />
      </UserIcon>
      <SubmittedPlayerText>
        {submitNum}/{maxSubmitNum}
      </SubmittedPlayerText>
    </SubmittedPlayerWrapper>
  );
}

const UserIcon = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const SubmittedPlayerWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  margin-top: 15px;
  height: max-content;
  width: max-content;
`;

const SubmittedPlayerText = styled.div`
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: 18px;
  height: max-content;
  width: max-content;
  margin: auto 0;
`;

export default React.memo(SubmittedPlayer);
