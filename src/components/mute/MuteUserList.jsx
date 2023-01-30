import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MuteUser from './MuteUser';

function MuteUserList({ socketID }) {
  const users = useSelector((state) => state.mute.connectedUsers);
  return (
    <div>
      {users.length !== 0 && (
        <UserList>
          {users.map((v) => {
            return socketID !== v.socketID && <MuteUser key={v.socketID} user={v} />;
          })}
        </UserList>
      )}
    </div>
  );
}

const UserList = styled.div`
  width: 200px;
  height: max-content;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

export default MuteUserList;
