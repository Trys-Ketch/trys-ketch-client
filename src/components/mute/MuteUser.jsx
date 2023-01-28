import React from 'react';
import styled from 'styled-components';
import MuteButton from './MuteButton';

function MuteUser({ user }) {
  // const users = useSelector((state) => state.mute.users);
  return (
    <UserWrapper>
      <User>{`${user.nickname}`}</User>
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
`;

export default MuteUser;
