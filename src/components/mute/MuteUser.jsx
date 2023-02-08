import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useObserveSpeaking from '../../hooks/useObserveSpeaking';
import MuteButton from './MuteButton';

function MuteUser({ user }) {
  const { pc } = user;
  const [isSpeaking, setIsSpeaking] = useState(false);
  useObserveSpeaking(pc, setIsSpeaking);

  return (
    <UserWrapper>
      <User isSpeaking={isSpeaking}>{`${user.nickname}`}</User>
      <MuteButton socketID={user.socketID} isMuted={user.isMuted} />
    </UserWrapper>
  );
}

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const User = styled.div`
  height: 30px;
  line-height: 30px;
  margin-right: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${(props) =>
    props.isSpeaking &&
    css`
      color: ${({ theme }) => theme.colors.DEEP_BLUE};
      font-weight: ${({ theme }) => theme.fontWeight.semibold};
    `}
`;

export default MuteUser;
